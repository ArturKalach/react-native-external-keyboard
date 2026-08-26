//
//  RNCEKVOrderGroupBaseTests.mm
//  ExternalKeyboardExampleTests
//

#import <UIKit/UIKit.h>
#import <XCTest/XCTest.h>
#import <React/RCTUtils.h>

#import "RNCEKVExternalKeyboardView.h"
#import "RNCEKVViewOrderGroupBase.h"
#import "UIViewController+RNCEKVExternalKeyboard.h"
#import "RNCEKVTestSupport.h"

@interface RNCEKVOrderGroupBaseTests : XCTestCase
@end

@implementation RNCEKVOrderGroupBaseTests

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

- (void)test_getIsViewFocused_descendantNext_true {
  RNCEKVExternalKeyboardView *view = [[RNCEKVExternalKeyboardView alloc] initWithFrame:CGRectZero];
  UIView *child = [[UIView alloc] initWithFrame:CGRectZero];
  UIView *grandchild = [[UIView alloc] initWithFrame:CGRectZero];
  [view addSubview:child];
  [child addSubview:grandchild];

  RNCEKVTestFocusContext *childContext = [RNCEKVTestFocusContext new];
  childContext.nextFocusedView = child;
  XCTAssertTrue([view getIsViewFocused:(UIFocusUpdateContext *)childContext]);

  RNCEKVTestFocusContext *grandchildContext = [RNCEKVTestFocusContext new];
  grandchildContext.nextFocusedView = grandchild;
  XCTAssertTrue([view getIsViewFocused:(UIFocusUpdateContext *)grandchildContext]);
}

- (void)test_getIsViewFocused_outsideOrNilNext_false {
  RNCEKVExternalKeyboardView *view = [[RNCEKVExternalKeyboardView alloc] initWithFrame:CGRectZero];
  UIView *outside = [[UIView alloc] initWithFrame:CGRectZero];

  RNCEKVTestFocusContext *outsideContext = [RNCEKVTestFocusContext new];
  outsideContext.nextFocusedView = outside;
  XCTAssertFalse([view getIsViewFocused:(UIFocusUpdateContext *)outsideContext]);

  RNCEKVTestFocusContext *nilContext = [RNCEKVTestFocusContext new];
  nilContext.nextFocusedView = nil;
  XCTAssertFalse([view getIsViewFocused:(UIFocusUpdateContext *)nilContext]);
}

// Both tests below target -[RNCEKVViewOrderGroupBase focus] directly (not
// -[RNCEKVViewFocusRequestBase focus], the version that "focus" resolves to
// on the concrete RNCEKVExternalKeyboardView chain, which routes self
// through the service instead of getStoredView) — a plain
// RNCEKVViewOrderGroupBase instance, rather than a leaf view further down
// the base chain, is required for Objective-C dynamic dispatch to reach
// this exact override.
- (void)test_focus_attached_routesStoredViewThroughService {
  RNCEKVViewOrderGroupBase *view = [[RNCEKVViewOrderGroupBase alloc] initWithFrame:CGRectZero];
  UIView *child = [[UIView alloc] initWithFrame:CGRectZero];
  [view addSubview:child];

  UIWindow *localWindow = [self attachUnderLocalRootController:view];
  XCTAssertNotNil(localWindow.rootViewController, @"reactViewController resolution requires a live root controller");

  [view focus];

  XCTAssertEqualObjects([view getStoredView], child);
  XCTAssertEqualObjects(RCTKeyWindow().rootViewController.rncekvCustomFocusView, [view getStoredView]);
}

- (void)test_focus_detached_noop {
  RNCEKVViewOrderGroupBase *view = [[RNCEKVViewOrderGroupBase alloc] initWithFrame:CGRectZero];
  UIView *child = [[UIView alloc] initWithFrame:CGRectZero];
  [view addSubview:child];

  [view focus];

  XCTAssertNil(RCTKeyWindow().rootViewController.rncekvCustomFocusView);
}

@end
