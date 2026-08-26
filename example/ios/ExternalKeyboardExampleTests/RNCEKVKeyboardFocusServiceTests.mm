//
//  RNCEKVKeyboardFocusServiceTests.mm
//  ExternalKeyboardExampleTests
//

#import <XCTest/XCTest.h>
#import <React/RCTUtils.h>

#import "RNCEKVKeyboardFocusService.h"
#import "UIViewController+RNCEKVExternalKeyboard.h"
#import "RNCEKVTestSupport.h"

@interface RNCEKVKeyboardFocusServiceTests : XCTestCase
@end

@implementation RNCEKVKeyboardFocusServiceTests

- (void)setUp {
  [super setUp];
  RNCEKVResetRootCustomFocusView();
}

- (void)tearDown {
  RNCEKVResetRootCustomFocusView();
  [super tearDown];
}

- (void)test_focusNil_preservesExistingCustomFocusView {
  UIViewController *rootController = RCTKeyWindow().rootViewController;
  XCTAssertNotNil(rootController);

  UIView *existingFocusView = [UIView new];
  rootController.rncekvCustomFocusView = existingFocusView;
  UIViewController *fallbackController = [UIViewController new];

  [RNCEKVKeyboardFocusService focus:nil withFallback:fallbackController];

  XCTAssertEqual(rootController.rncekvCustomFocusView, existingFocusView);
}

- (void)test_focus_windowlessTarget_fallsBackToKeyWindowRoot {
  UIViewController *rootController = RCTKeyWindow().rootViewController;
  XCTAssertNotNil(rootController);

  UIViewController *fallbackController = [UIViewController new];
  UIView *focusTarget = [UIView new];

  [RNCEKVKeyboardFocusService focus:focusTarget withFallback:fallbackController];

  XCTAssertEqual(rootController.rncekvCustomFocusView, focusTarget);
  XCTAssertNil(fallbackController.rncekvCustomFocusView);
}

- (void)test_focusWrapper_delegatesToFallbackVariant {
  UIViewController *rootController = RCTKeyWindow().rootViewController;
  XCTAssertNotNil(rootController);

  UIView *focusTarget = [UIView new];

  [RNCEKVKeyboardFocusService focus:focusTarget];

  XCTAssertEqual(rootController.rncekvCustomFocusView, focusTarget);
}

- (void)test_focus_targetWithWindow_prefersTargetWindowRoot {
  UIWindow *localWindow = [[UIWindow alloc] initWithFrame:CGRectMake(0, 0, 100, 100)];
  localWindow.rootViewController = [UIViewController new];
  UIView *target = [UIView new];
  [localWindow.rootViewController.view addSubview:target];
  localWindow.hidden = NO;

  UIViewController *fallback = [UIViewController new];

  [RNCEKVKeyboardFocusService focus:target withFallback:fallback];

  XCTAssertEqualObjects(localWindow.rootViewController.rncekvCustomFocusView, target);
  XCTAssertNil(RCTKeyWindow().rootViewController.rncekvCustomFocusView);
  XCTAssertNil(fallback.rncekvCustomFocusView);

  localWindow.hidden = YES;
}

- (void)test_focus_returnsRoutedController {
  UIWindow *localWindow = [[UIWindow alloc] initWithFrame:CGRectMake(0, 0, 100, 100)];
  localWindow.rootViewController = [UIViewController new];
  UIView *target = [UIView new];
  [localWindow.rootViewController.view addSubview:target];
  localWindow.hidden = NO;

  UIViewController *fallback = [UIViewController new];

  UIViewController *routed = [RNCEKVKeyboardFocusService focus:target withFallback:fallback];
  XCTAssertEqualObjects(routed, localWindow.rootViewController);

  XCTAssertEqualObjects([RNCEKVKeyboardFocusService focus:[UIView new] withFallback:fallback],
                        RCTKeyWindow().rootViewController);

  localWindow.hidden = YES;
}

- (void)test_focus_nilView_returnsNil {
  XCTAssertNil([RNCEKVKeyboardFocusService focus:nil withFallback:[UIViewController new]]);
}

@end
