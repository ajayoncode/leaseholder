

#import "SplashScreen.h"
#import <React/RCTBridge.h>

static bool waiting = true;
static bool addedJsLoadErrorObserver = false;
static UIView* loadingView = nil;

@implementation SplashScreen
- (dispatch_queue_t)methodQueue{
  return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE(SplashScreen)

+ (void)show {
  if (!addedJsLoadErrorObserver) {
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(jsLoadError:) name:RCTJavaScriptDidFailToLoadNotification object:nil];
    addedJsLoadErrorObserver = true;
  }
  
  while (waiting) {
    NSDate* later = [NSDate dateWithTimeIntervalSinceNow:0.3];
    [[NSRunLoop mainRunLoop] runUntilDate:later];
  }
}

+ (void)showSplash:(NSString*)splashScreen inRootView:(UIView*)rootView {
  if (!loadingView) {
    loadingView = [[[NSBundle mainBundle] loadNibNamed:splashScreen owner:self options:nil] objectAtIndex:0];
    CGRect frame = rootView.frame;
    frame.origin = CGPointMake(0, 0);
    loadingView.frame = frame;
  }
  waiting = false;
  
  [rootView addSubview:loadingView];
}

+ (void)hide {
  if (waiting) {
    dispatch_async(dispatch_get_main_queue(), ^{
      waiting = false;
    });
  } else {
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
      [loadingView removeFromSuperview];
    });
  }
}

+ (void) jsLoadError:(NSNotification*)notification
{
  // If there was an error loading javascript, hide the splash screen so it can be shown.  Otherwise the splash screen will remain forever, which is a hassle to debug.
  [SplashScreen hide];
}

RCT_EXPORT_METHOD(hide) {
  [SplashScreen hide];
}

RCT_EXPORT_METHOD(show) {
  [SplashScreen show];
}

RCT_EXPORT_METHOD(saveFileIntoDocumentDirectory:(NSString *)stringURL callback:(RCTResponseSenderBlock)callback){

  NSURL  *url = [NSURL URLWithString:stringURL];
  NSData *urlData = [NSData dataWithContentsOfURL:url];
  if ( urlData )
  {
    NSArray       *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString  *documentsDirectory = [paths objectAtIndex:0];
    
    NSString  *filePath = [NSString stringWithFormat:@"%@/filename.%@", documentsDirectory,stringURL.pathExtension];
    if([urlData writeToFile:filePath atomically:YES]){
      callback(@[filePath]);
    }else{
      callback(@[@""]);

    }
    
    
    
  }
  
}
@end
