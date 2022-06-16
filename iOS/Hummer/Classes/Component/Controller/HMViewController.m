//
//  HMViewController.h
//  Hummer
//
//  Copyright © 2019年 didi. All rights reserved.
//

#import "HMViewController.h"
#import "Hummer.h"
#import "HMJSGlobal.h"
#import <Hummer/HMBaseExecutorProtocol.h>
#import <Hummer/HMRootViewLifeCycle.h>
#import "HMBaseValue.h"
#import "HMThreadManager.h"
#import "HMRootComponent.h"
#if __has_include(<SocketRocket/SRWebSocket.h>)
#import <SocketRocket/SRWebSocket.h>
#endif

@interface HMViewController ()<HMJSContextDelegate>

@property (nonatomic, strong) UIView *naviView;
@property (nonatomic, strong) UIView *hmRootView;

@property (nonatomic, strong) HMRootViewLifeCycle *lifeCycle;

@property (nonatomic, strong) HMJSContext  * context;
@property (nonatomic, weak) UIView * pageView;

@end

@implementation HMViewController

+ (instancetype)hmxPageControllerWithURL:(NSString *)URL
                                  params:(NSDictionary *)params {
    if (!URL) {
        return nil;
    }
    return [[self alloc] initWithURL:URL params:params];
}

- (instancetype)initWithURL:(NSString *)URL
                     params:(NSDictionary *)params {
    if (self = [super init]) {
        self.URL = URL ;
        self.params = params;
    }
    return self;
}

- (void)addCustomNavigationView:(UIView *)customNaviView {
    if (nil == customNaviView) {
        return;
    }
    [self.naviView removeFromSuperview];
    [self.view addSubview:customNaviView];
    self.naviView = customNaviView;
    
    CGFloat naviHeight = self.naviView ? CGRectGetHeight(self.naviView.frame) : 0;
    CGFloat hmHeight = CGRectGetHeight(self.view.bounds) - naviHeight;
    CGFloat hmWidth = CGRectGetWidth(self.view.bounds);
    
    CGRect containerFrame = CGRectMake(0, naviHeight, hmWidth, hmHeight);
    self.hmRootView.frame = containerFrame;
}

- (void)initHMRootView {
    /** hummer渲染view */
    self.hmRootView = [[UIView alloc] initWithFrame:self.view.bounds];
    self.hmRootView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    [self.view addSubview:self.hmRootView];
}

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];
    self.automaticallyAdjustsScrollViewInsets = NO;
    self.lifeCycle = [HMRootViewLifeCycle create];
    [self initHMRootView];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(didBecomeActive) name:UIApplicationDidBecomeActiveNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(didEnterBackground) name:UIApplicationDidEnterBackgroundNotification object:nil];
    
    if (!self.hm_pageID.length) {
        self.hm_pageID = @([self hash]).stringValue;
    }
    
    if ([[NSURL URLWithString:self.URL].pathExtension containsString:@"js"] && ([self.URL hasPrefix:@"http"] ||[self.URL hasPrefix:@"https"]))
    {// hummer js 模式加载
        __weak typeof(self)weakSelf = self;
        [HMJavaScriptLoader loadBundleWithURL:[NSURL URLWithString:self.URL] onProgress:^(HMLoaderProgress *progressData) {
        } onComplete:^(NSError *error, HMDataSource *source) {
            __strong typeof(self) self = weakSelf;
            if (!error) {
                HMExecOnMainQueue(^{
                    NSString *script = [[NSString alloc] initWithData:source.data encoding:NSUTF8StringEncoding];
                    [self renderWithScript:script];
                });
            }
        }];
    }else {
        //hummer 离线包模式加载
        NSString * script = nil;
        if (self.loadBundleJSBlock) {
            script = HM_SafeRunBlock(self.loadBundleJSBlock,self.URL);
        }else if ([[NSURL URLWithString:self.URL].pathExtension containsString:@"js"] && [self.URL hasPrefix:@"file"]){
            script = [NSString stringWithContentsOfURL:[NSURL URLWithString:self.URL] encoding:NSUTF8StringEncoding error:nil];
        }
        [self renderWithScript:script];
    }
}


- (void)didBecomeActive {
    UIViewController *vc = HMTopViewController();
    if (vc != self) {
        return;
    }
    [self.lifeCycle onAppear];
}

- (void)didEnterBackground{
    UIViewController *vc = HMTopViewController();
    if (vc != self) {
        return;
    }
    [self.lifeCycle onDisappear];
}
#pragma mark -渲染脚本
static struct timespec createTimespec;

- (void)renderWithScript:(NSString *)script {
    if (script.length == 0) {
        return;
    }
    
    //设置页面参数
    NSMutableDictionary * pData = [NSMutableDictionary dictionary];
    if (self.URL) {
        pData[@"url"]=self.URL;
    }
    pData[@"params"] = self.params ?: @{};
    CGSize viewSize = self.hmRootView.frame.size;
    HMClockGetTime(&createTimespec);
    [HMThreadManager setupJSThread:^{
        //渲染脚本之前 注册bridge
        HMRootComponent *root = [[HMRootComponent alloc] initWithNativeView:self.hmRootView];
        root.availableSize = viewSize;
        HMJSContext *context = [HMJSContext contextInRootView:root];
        self.context = context;
        context.pageInfo = pData;
        context.delegate = self;
        if ([self respondsToSelector:@selector(hm_namespace)]) {
            context.nameSpace = [self hm_namespace];
        }
        HM_SafeRunBlock(self.registerJSBridgeBlock,context);
        
        //执行脚本
        [context evaluateScript:script fileName:self.URL];
//        self.pageView = self.hmRootView.subviews.firstObject;
//        [self.lifeCycle setJSValue:self.pageView.hmValue];
    }];
    
}

#pragma mark - View 生命周期管理
- (BOOL)hm_didClickGoBack {
    if ([[self callJSWithFunc:@"onBack" arguments:@[]] toBool]) {return YES;}
    if ([self respondsToSelector:@selector(hm_triggerNativeGoBack)]) {
        [self hm_triggerNativeGoBack];
    }else{
        if (self.navigationController) {
            [self.navigationController popViewControllerAnimated:YES];
        }
    }
    return NO;
}
- (void)viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];
    [self.lifeCycle onAppear];
}

- (void)viewDidDisappear:(BOOL)animated {
    [super viewDidDisappear:animated];
    [self.lifeCycle onDisappear];
}

- (void)didMoveToParentViewController:(UIViewController *)parent {
    if (!parent) {
        id pageResult = nil;
        HMBaseValue * jsPageResult = self.pageView.hmContext[@"Hummer"][@"pageResult"];
        if (!jsPageResult.isNull || !jsPageResult.isUndefined) {
            if (jsPageResult.isObject) {
                pageResult = jsPageResult.toObject;
            }else if (jsPageResult.isNumber){
                pageResult = jsPageResult.toNumber;
            }else if (jsPageResult.isBoolean){
                pageResult = @(jsPageResult.toBool);
            }
        }
        HM_SafeRunBlock(self.hm_dismissBlock,pageResult);
    }
}

- (void)dealloc {
    [self.lifeCycle onDestroy];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIApplicationDidBecomeActiveNotification object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIApplicationDidEnterBackgroundNotification object:nil];
}

#pragma mark - Call Hummer

- (HMBaseValue *)callJSWithFunc:(NSString *)func arguments:(NSArray *)arguments {
    HMBaseValue * page = self.pageView.hmValue;
    if ([page hasProperty:func]) {
        return [page invokeMethod:func withArguments:arguments];
    }
    return nil;
}


#pragma mark - HMJSContextDelegate

- (void)context:(HMJSContext *)context reloadBundle:(NSDictionary *)bundleInfo {
    
    __weak typeof(self)weakSelf = self;
    HMExecOnMainQueue(^{
        if (!weakSelf) {
            return;
        }
        [self callJSWithFunc:@"onDestroy" arguments:@[]];
        [self.hmRootView.subviews enumerateObjectsUsingBlock:^(__kindof UIView * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
            [obj removeFromSuperview];
        }];
        NSString *URLString = [bundleInfo valueForKey:@"url"];
        NSURL * URL  = [NSURL URLWithString:URLString];
        if (!URL) {
            return;
        }
        [HMJavaScriptLoader loadBundleWithURL:URL onProgress:^(HMLoaderProgress *progressData) {
        } onComplete:^(NSError *error, HMDataSource *source) {
            __strong typeof(self) self = weakSelf;
            if (!error) {
                HMExecOnMainQueue(^{
                    NSString *script = [[NSString alloc] initWithData:source.data encoding:NSUTF8StringEncoding];
                    [self renderWithScript:script];
                });
            }
        }];
    });
}

- (void)context:(HMJSContext *)context didRenderPage:(HMBaseValue *)page {
    
    dispatch_async(dispatch_get_main_queue(), ^{
        static struct timespec createTimespec2;
        HMClockGetTime(&createTimespec2);
        static struct timespec resultTimespec;
        HMDiffTime(&createTimespec, &createTimespec2, &resultTimespec);
        NSNumber *duration = @(resultTimespec.tv_sec * 1000 + resultTimespec.tv_nsec / 1000000);
        NSLog(@"duration = %lld", duration.longLongValue);
    });
}
@end
