//
//  RNCEKVTextInputFocusWrapperTests.mm
//  ExternalKeyboardExampleTests
//

#import <UIKit/UIKit.h>
#import <XCTest/XCTest.h>
#import <React/RCTUtils.h>

#import "RNCEKVTextInputFocusWrapper.h"
#import "UIViewController+RNCEKVExternalKeyboard.h"
#import "RNCEKVTestSupport.h"

// -updateFocus: is internal to RNCEKVTextInputFocusWrapper.mm and absent from
// the public header; exposed here for the single test that drives it directly.
@interface RNCEKVTextInputFocusWrapper (Testing)
- (void)updateFocus:(UIViewController *)controller;
@end

@interface RNCEKVTextInputFocusWrapperTests : XCTestCase
@end

@implementation RNCEKVTextInputFocusWrapperTests

- (void)setUp {
  [super setUp];
  RNCEKVResetRootCustomFocusView();
}

- (void)tearDown {
  RNCEKVResetRootCustomFocusView();
  [super tearDown];
}

/// Attaches `view` under a local (non-key) window's root controller so
/// `reactViewController` resolves without touching the host app's real key window.
- (UIWindow *)attachUnderLocalRootController:(UIView *)view {
  UIWindow *localWindow = [[UIWindow alloc] initWithFrame:CGRectMake(0, 0, 100, 100)];
  UIViewController *localController = [UIViewController new];
  localWindow.rootViewController = localController;
  [localController.view addSubview:view];
  localWindow.hidden = NO;
  return localWindow;
}

- (void)test_focus_detached_parks {
  RNCEKVTextInputFocusWrapper *wrapper = [[RNCEKVTextInputFocusWrapper alloc] initWithFrame:CGRectZero];

  [wrapper focus];

  XCTAssertNil(RCTKeyWindow().rootViewController.rncekvCustomFocusView);
}

- (void)test_didMoveToWindow_replaysPendingFocus_toFirstSubview {
  RNCEKVTextInputFocusWrapper *wrapper = [[RNCEKVTextInputFocusWrapper alloc] initWithFrame:CGRectZero];
  [wrapper focus];

  UIView *first = [[UIView alloc] initWithFrame:CGRectZero];
  UIView *second = [[UIView alloc] initWithFrame:CGRectZero];
  [wrapper addSubview:first];
  [wrapper addSubview:second];

  UIWindow *localWindow = [self attachUnderLocalRootController:wrapper];
  XCTAssertNotNil(localWindow.rootViewController, @"reactViewController resolution requires a live root controller");

  XCTAssertEqualObjects(RCTKeyWindow().rootViewController.rncekvCustomFocusView, first);
}

- (void)test_replay_singleShot {
  RNCEKVTextInputFocusWrapper *wrapper = [[RNCEKVTextInputFocusWrapper alloc] initWithFrame:CGRectZero];
  [wrapper focus];
  UIView *child = [[UIView alloc] initWithFrame:CGRectZero];
  [wrapper addSubview:child];

  UIWindow *localWindow = [self attachUnderLocalRootController:wrapper];
  XCTAssertEqualObjects(RCTKeyWindow().rootViewController.rncekvCustomFocusView, child,
                         @"replay must have run once before the single-shot leg is exercised");

  RNCEKVResetRootCustomFocusView();
  [wrapper removeFromSuperview];
  [localWindow.rootViewController.view addSubview:wrapper];

  XCTAssertNil(RCTKeyWindow().rootViewController.rncekvCustomFocusView);
}

- (void)test_cleanReferences_clearsPending {
  RNCEKVTextInputFocusWrapper *wrapper = [[RNCEKVTextInputFocusWrapper alloc] initWithFrame:CGRectZero];
  [wrapper focus];

  [wrapper cleanReferences];

  UIView *child = [[UIView alloc] initWithFrame:CGRectZero];
  [wrapper addSubview:child];
  [self attachUnderLocalRootController:wrapper];

  XCTAssertNil(RCTKeyWindow().rootViewController.rncekvCustomFocusView);
}

- (void)test_updateFocus_noSubviews_serviceNilGuard_noop {
  RNCEKVTextInputFocusWrapper *wrapper = [[RNCEKVTextInputFocusWrapper alloc] initWithFrame:CGRectZero];
  UIWindow *localWindow = [self attachUnderLocalRootController:wrapper];

  UIView *preExistingFocusView = [UIView new];
  RCTKeyWindow().rootViewController.rncekvCustomFocusView = preExistingFocusView;

  [wrapper updateFocus:localWindow.rootViewController];

  XCTAssertEqualObjects(RCTKeyWindow().rootViewController.rncekvCustomFocusView, preExistingFocusView);
}

- (void)test_newArch_onFocusChange_gate_noCrashBothWays {
  RNCEKVTextInputFocusWrapper *wrapper = [[RNCEKVTextInputFocusWrapper alloc] initWithFrame:CGRectZero];

  wrapper.hasOnFocusChanged = NO;
  XCTAssertNoThrow([wrapper onFocusChangeHandler:YES]);

  wrapper.hasOnFocusChanged = YES;
  XCTAssertNoThrow([wrapper onFocusChangeHandler:NO]);
}

@end
