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

  XCTAssertEqualObjects(localWindow.rootViewController.rncekvCustomFocusView, first);
  XCTAssertNil(RCTKeyWindow().rootViewController.rncekvCustomFocusView);
}

- (void)test_replay_singleShot {
  RNCEKVTextInputFocusWrapper *wrapper = [[RNCEKVTextInputFocusWrapper alloc] initWithFrame:CGRectZero];
  [wrapper focus];
  UIView *child = [[UIView alloc] initWithFrame:CGRectZero];
  [wrapper addSubview:child];

  UIWindow *localWindow = [self attachUnderLocalRootController:wrapper];
  XCTAssertEqualObjects(localWindow.rootViewController.rncekvCustomFocusView, child,
                         @"replay must have run once before the single-shot leg is exercised");

  localWindow.rootViewController.rncekvCustomFocusView = nil;
  RNCEKVResetRootCustomFocusView();
  [wrapper removeFromSuperview];
  [localWindow.rootViewController.view addSubview:wrapper];

  XCTAssertNil(localWindow.rootViewController.rncekvCustomFocusView);
}

- (void)test_cleanReferences_clearsPending {
  RNCEKVTextInputFocusWrapper *wrapper = [[RNCEKVTextInputFocusWrapper alloc] initWithFrame:CGRectZero];
  [wrapper focus];

  [wrapper cleanReferences];

  UIView *child = [[UIView alloc] initWithFrame:CGRectZero];
  [wrapper addSubview:child];
  UIWindow *localWindow = [self attachUnderLocalRootController:wrapper];

  XCTAssertNil(RCTKeyWindow().rootViewController.rncekvCustomFocusView);
  XCTAssertNil(localWindow.rootViewController.rncekvCustomFocusView);
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

- (void)test_focus_attachedWithoutChild_parks_thenReplaysAfterReattachWithChild {
  RNCEKVTextInputFocusWrapper *wrapper = [[RNCEKVTextInputFocusWrapper alloc] initWithFrame:CGRectZero];
  UIWindow *localWindow = [self attachUnderLocalRootController:wrapper];

  [wrapper focus];
  XCTAssertNil(localWindow.rootViewController.rncekvCustomFocusView);
  XCTAssertNil(RCTKeyWindow().rootViewController.rncekvCustomFocusView);

  [wrapper removeFromSuperview];
  UIView *child = [UIView new];
  [wrapper addSubview:child];
  [localWindow.rootViewController.view addSubview:wrapper];

  XCTAssertEqualObjects(localWindow.rootViewController.rncekvCustomFocusView, child,
                        @"pending survives detach and replays once the child exists");
}

- (void)test_focus_windowNilWithController_parks {
  UIViewController *vc = [UIViewController new];
  RNCEKVTextInputFocusWrapper *wrapper = [[RNCEKVTextInputFocusWrapper alloc] initWithFrame:CGRectZero];
  UIView *child = [UIView new];
  [wrapper addSubview:child];
  [vc.view addSubview:wrapper];

  [wrapper focus];

  XCTAssertNil(vc.rncekvCustomFocusView);
  XCTAssertNil(RCTKeyWindow().rootViewController.rncekvCustomFocusView);
}

- (void)test_detach_clearsRoutedChildPreference {
  RNCEKVTextInputFocusWrapper *wrapper = [[RNCEKVTextInputFocusWrapper alloc] initWithFrame:CGRectZero];
  UIView *child = [UIView new];
  [wrapper addSubview:child];
  UIWindow *localWindow = [self attachUnderLocalRootController:wrapper];

  [wrapper focus];
  XCTAssertEqualObjects(localWindow.rootViewController.rncekvCustomFocusView, child);

  [wrapper removeFromSuperview];

  XCTAssertNil(localWindow.rootViewController.rncekvCustomFocusView);
}

- (void)test_detach_preservesForeignPreference {
  RNCEKVTextInputFocusWrapper *wrapper = [[RNCEKVTextInputFocusWrapper alloc] initWithFrame:CGRectZero];
  UIView *child = [UIView new];
  [wrapper addSubview:child];
  UIWindow *localWindow = [self attachUnderLocalRootController:wrapper];

  [wrapper focus];

  UIView *other = [UIView new];
  localWindow.rootViewController.rncekvCustomFocusView = other;
  [wrapper removeFromSuperview];

  XCTAssertEqualObjects(localWindow.rootViewController.rncekvCustomFocusView, other);
}

// Returns UIFocusUpdateContext* (not RNCEKVTestFocusContext*): -resolveFocusChange:
// is declared to take UIFocusUpdateContext*, whose static type this double does
// not subclass (see RNCEKVTestFocusContext's header comment) — the cast keeps the
// call site's static type correct while dynamic dispatch resolves against the
// accessors the double actually implements.
- (UIFocusUpdateContext *)contextWithNext:(UIView *)next previous:(UIView *)previous {
  RNCEKVTestFocusContext *context = [RNCEKVTestFocusContext new];
  context.nextFocusedView = next;
  context.previouslyFocusedView = previous;
  return (UIFocusUpdateContext *)context;
}

- (void)test_resolveFocusChange_firstDescendantEntry_yes {
  RNCEKVTextInputFocusWrapper *wrapper = [[RNCEKVTextInputFocusWrapper alloc] initWithFrame:CGRectZero];
  UIView *child = [[UIView alloc] initWithFrame:CGRectZero];
  [wrapper addSubview:child];

  UIFocusUpdateContext *context = [self contextWithNext:child previous:nil];

  XCTAssertEqualObjects([wrapper resolveFocusChange:context], @YES);
}

- (void)test_resolveFocusChange_descendantToDescendant_nil {
  RNCEKVTextInputFocusWrapper *wrapper = [[RNCEKVTextInputFocusWrapper alloc] initWithFrame:CGRectZero];
  UIView *child = [[UIView alloc] initWithFrame:CGRectZero];
  UIView *child2 = [[UIView alloc] initWithFrame:CGRectZero];
  [wrapper addSubview:child];
  [wrapper addSubview:child2];

  [wrapper resolveFocusChange:[self contextWithNext:child previous:nil]];

  UIFocusUpdateContext *secondEntry = [self contextWithNext:child2 previous:child];
  XCTAssertNil([wrapper resolveFocusChange:secondEntry]);
}

- (void)test_resolveFocusChange_leave_reportsNo {
  RNCEKVTextInputFocusWrapper *wrapper = [[RNCEKVTextInputFocusWrapper alloc] initWithFrame:CGRectZero];
  UIView *child = [[UIView alloc] initWithFrame:CGRectZero];
  [wrapper addSubview:child];
  [wrapper resolveFocusChange:[self contextWithNext:child previous:nil]];

  UIView *outside = [[UIView alloc] initWithFrame:CGRectZero];
  UIFocusUpdateContext *leave = [self contextWithNext:outside previous:child];

  XCTAssertEqualObjects([wrapper resolveFocusChange:leave], @NO);
}

- (void)test_resolveFocusChange_trackedChildDeallocated_blurStillReported {
  RNCEKVTextInputFocusWrapper *wrapper = [[RNCEKVTextInputFocusWrapper alloc] initWithFrame:CGRectZero];

  __weak UIView *weakChild;
  @autoreleasepool {
    UIView *child = [[UIView alloc] initWithFrame:CGRectZero];
    [wrapper addSubview:child];
    weakChild = child;

    [wrapper resolveFocusChange:[self contextWithNext:child previous:nil]];
    [child removeFromSuperview];
  }
  XCTAssertNil(weakChild);

  UIView *outside = [[UIView alloc] initWithFrame:CGRectZero];
  UIFocusUpdateContext *afterDealloc = [self contextWithNext:outside previous:[UIView new]];

  XCTAssertEqualObjects([wrapper resolveFocusChange:afterDealloc], @NO);
}

@end
