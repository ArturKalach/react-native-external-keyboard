//
//  RNCEKVFocusRequestBaseTests.mm
//  ExternalKeyboardExampleTests
//

#import <UIKit/UIKit.h>
#import <XCTest/XCTest.h>
#import <React/RCTUtils.h>

#import "RNCEKVExternalKeyboardView.h"
#import "UIViewController+RNCEKVExternalKeyboard.h"
#import "RNCEKVTestSupport.h"

// Counts getFocusTargetView calls so screenReaderFocus park/replay tests can
// assert on the delta around a step instead of an absolute count, keeping
// them immune to incidental getFocusTargetView traffic elsewhere.
@interface RNCEKVScreenReaderSpyView : RNCEKVExternalKeyboardView
@property (nonatomic, assign) NSUInteger focusTargetQueryCount;
@end

@implementation RNCEKVScreenReaderSpyView

- (UIView *)getFocusTargetView {
  self.focusTargetQueryCount += 1;
  return [super getFocusTargetView];
}

@end

@interface RNCEKVFocusRequestBaseTests : XCTestCase
@end

@implementation RNCEKVFocusRequestBaseTests {
  UIWindow *_window;
  UIViewController *_rootController;
}

- (void)setUp {
  [super setUp];
  RNCEKVResetRootCustomFocusView();
  _rootController = [UIViewController new];
  _window = [[UIWindow alloc] initWithFrame:CGRectMake(0, 0, 100, 100)];
  _window.rootViewController = _rootController;
  _window.hidden = NO;
}

- (void)tearDown {
  _rootController.rncekvCustomFocusView = nil;
  _window.hidden = YES;
  _window = nil;
  _rootController = nil;
  RNCEKVResetRootCustomFocusView();
  [super tearDown];
}

- (RNCEKVExternalKeyboardView *)makeView {
  return [[RNCEKVExternalKeyboardView alloc] initWithFrame:CGRectMake(0, 0, 44, 44)];
}

- (void)test_focus_detached_parks_thenReplaysOnAttach {
  RNCEKVExternalKeyboardView *view = [self makeView];

  [view focus];
  XCTAssertNil(RCTKeyWindow().rootViewController.rncekvCustomFocusView,
               @"a detached view has no reactViewController, so focus should park rather than route");
  XCTAssertNil(_rootController.rncekvCustomFocusView,
               @"a detached view has no reactViewController, so focus should park rather than route");

  [_rootController.view addSubview:view];

  XCTAssertEqualObjects(_rootController.rncekvCustomFocusView, view,
                        @"replay routes through the view's own window root");
  XCTAssertNil(RCTKeyWindow().rootViewController.rncekvCustomFocusView,
               @"the key-window root is only a fallback for windowless targets");
}

- (void)test_attach_withoutPending_doesNotFocus {
  RNCEKVExternalKeyboardView *view = [self makeView];
  view.autoFocus = NO;

  [_rootController.view addSubview:view];
  RNCEKVDrainMainQueue(2);

  XCTAssertNil(RCTKeyWindow().rootViewController.rncekvCustomFocusView);
  XCTAssertNil(_rootController.rncekvCustomFocusView);
}

- (void)test_cleanReferences_clearsPendingFocus {
  RNCEKVExternalKeyboardView *view = [self makeView];

  [view focus];
  [view cleanReferences];
  [_rootController.view addSubview:view];

  XCTAssertNil(RCTKeyWindow().rootViewController.rncekvCustomFocusView,
               @"cleanReferences should clear the parked pending focus request before attach can replay it");
  XCTAssertNil(_rootController.rncekvCustomFocusView,
               @"cleanReferences should clear the parked pending focus request before attach can replay it");
}

- (void)test_pendingReplay_singleShot_notOnReattach {
  RNCEKVExternalKeyboardView *view = [self makeView];

  [view focus];
  [_rootController.view addSubview:view];
  XCTAssertEqualObjects(_rootController.rncekvCustomFocusView, view);

  _rootController.rncekvCustomFocusView = nil;
  RNCEKVResetRootCustomFocusView();
  [view removeFromSuperview];
  [_rootController.view addSubview:view];

  XCTAssertNil(_rootController.rncekvCustomFocusView,
               @"the parked focus request is single-shot and must not replay on a second attach");
}

- (void)test_autoFocus_attach_focusesAfterDoubleDispatch {
  RNCEKVExternalKeyboardView *view = [self makeView];
  view.autoFocus = YES;

  [_rootController.view addSubview:view];

  RNCEKVDrainMainQueue(1);
  XCTAssertNil(_rootController.rncekvCustomFocusView,
               @"the inner dispatch_async is still queued after a single drain cycle");

  RNCEKVDrainMainQueue(1);
  XCTAssertEqualObjects(_rootController.rncekvCustomFocusView, view,
                        @"focus should land only once both nested dispatch_async blocks have run");
}

- (void)test_autoFocus_generationBumped_staleDispatchDiscarded {
  RNCEKVExternalKeyboardView *view = [self makeView];
  view.autoFocus = YES;

  [_rootController.view addSubview:view];
  [view cleanReferences];

  RNCEKVDrainMainQueue(2);

  XCTAssertNil(RCTKeyWindow().rootViewController.rncekvCustomFocusView,
               @"cleanReferences bumps the autofocus generation, so the already-dispatched request is stale");
  XCTAssertNil(_rootController.rncekvCustomFocusView,
               @"cleanReferences bumps the autofocus generation, so the already-dispatched request is stale");
}

- (void)test_autoFocus_detachedBeforeDispatch_retriesOnNextAttach {
  RNCEKVExternalKeyboardView *view = [self makeView];
  view.autoFocus = YES;

  [_rootController.view addSubview:view];
  [view removeFromSuperview];

  RNCEKVDrainMainQueue(2);
  XCTAssertNil(_rootController.rncekvCustomFocusView,
               @"the window guard discards the dispatched autofocus while detached");

  [_rootController.view addSubview:view];
  RNCEKVDrainMainQueue(2);

  XCTAssertEqualObjects(_rootController.rncekvCustomFocusView, view,
                        @"the detached skip returns the attempt, so the next attach retries autofocus");
}

- (void)test_autoFocus_viewDeallocatedBeforeDispatch_noCrash {
  @autoreleasepool {
    RNCEKVExternalKeyboardView *view = [self makeView];
    view.autoFocus = YES;

    [_rootController.view addSubview:view];
    [view removeFromSuperview];
  }

  RNCEKVDrainMainQueue(2);

  XCTAssertNil(RCTKeyWindow().rootViewController.rncekvCustomFocusView);
  XCTAssertNil(_rootController.rncekvCustomFocusView);
}

- (void)test_autoFocus_singleShot_noRescheduleOnReattach {
  RNCEKVExternalKeyboardView *view = [self makeView];
  view.autoFocus = YES;

  [_rootController.view addSubview:view];
  RNCEKVDrainMainQueue(2);
  XCTAssertEqualObjects(_rootController.rncekvCustomFocusView, view);

  _rootController.rncekvCustomFocusView = nil;
  RNCEKVResetRootCustomFocusView();
  [view removeFromSuperview];
  [_rootController.view addSubview:view];
  RNCEKVDrainMainQueue(2);

  XCTAssertNil(_rootController.rncekvCustomFocusView,
               @"_autoFocusRequested is a single-shot latch; re-attaching without cleanReferences must not reschedule");
}

- (void)test_focus_controllerPresent_windowNil_parks_thenReplays {
  UIViewController *vc = [UIViewController new];
  RNCEKVExternalKeyboardView *view = [self makeView];
  [vc.view addSubview:view];

  [view focus];
  XCTAssertNil(vc.rncekvCustomFocusView);
  XCTAssertNil(RCTKeyWindow().rootViewController.rncekvCustomFocusView);

  UIWindow *window = [[UIWindow alloc] initWithFrame:CGRectMake(0, 0, 100, 100)];
  window.rootViewController = vc;
  window.hidden = NO;

  XCTAssertEqualObjects(vc.rncekvCustomFocusView, view);

  window.hidden = YES;
}

- (void)test_focus_attached_routesToOwnWindowRoot_notKeyRoot {
  RNCEKVExternalKeyboardView *view = [self makeView];
  [_rootController.view addSubview:view];

  [view focus];

  XCTAssertEqualObjects(_rootController.rncekvCustomFocusView, view);
  XCTAssertNil(RCTKeyWindow().rootViewController.rncekvCustomFocusView);
}

- (void)test_detach_clearsOwnRoutedPreference {
  RNCEKVExternalKeyboardView *view = [self makeView];
  [_rootController.view addSubview:view];
  [view focus];
  XCTAssertEqualObjects(_rootController.rncekvCustomFocusView, view);

  [view removeFromSuperview];

  XCTAssertNil(_rootController.rncekvCustomFocusView);
}

- (void)test_detach_preservesForeignPreference {
  RNCEKVExternalKeyboardView *view = [self makeView];
  [_rootController.view addSubview:view];
  [view focus];

  UIView *other = [UIView new];
  _rootController.rncekvCustomFocusView = other;
  [view removeFromSuperview];

  XCTAssertEqualObjects(_rootController.rncekvCustomFocusView, other);
}

- (void)test_cleanReferences_clearsOwnRoutedPreference {
  RNCEKVExternalKeyboardView *view = [self makeView];
  [_rootController.view addSubview:view];
  [view focus];

  [view cleanReferences];

  XCTAssertNil(_rootController.rncekvCustomFocusView);
}

- (void)test_screenReaderFocus_detached_parks_noDispatch {
  RNCEKVScreenReaderSpyView *spy = [[RNCEKVScreenReaderSpyView alloc] initWithFrame:CGRectMake(0, 0, 44, 44)];

  NSUInteger baseline = spy.focusTargetQueryCount;
  [spy screenReaderFocus];
  RNCEKVDrainMainQueue(1);

  XCTAssertEqual(spy.focusTargetQueryCount - baseline, 0u);
}

- (void)test_screenReaderFocus_replaysOnAttach {
  RNCEKVScreenReaderSpyView *spy = [[RNCEKVScreenReaderSpyView alloc] initWithFrame:CGRectMake(0, 0, 44, 44)];

  [spy screenReaderFocus];
  NSUInteger baseline = spy.focusTargetQueryCount;
  [_rootController.view addSubview:spy];
  RNCEKVDrainMainQueue(1);

  XCTAssertEqual(spy.focusTargetQueryCount - baseline, 1u);
}

- (void)test_screenReaderFocus_attached_postsAfterDispatch {
  RNCEKVScreenReaderSpyView *spy = [[RNCEKVScreenReaderSpyView alloc] initWithFrame:CGRectMake(0, 0, 44, 44)];
  [_rootController.view addSubview:spy];

  NSUInteger baseline = spy.focusTargetQueryCount;
  [spy screenReaderFocus];
  RNCEKVDrainMainQueue(1);

  XCTAssertEqual(spy.focusTargetQueryCount - baseline, 1u);
}

- (void)test_cleanReferences_clearsPendingScreenReaderFocus {
  RNCEKVScreenReaderSpyView *spy = [[RNCEKVScreenReaderSpyView alloc] initWithFrame:CGRectMake(0, 0, 44, 44)];

  [spy screenReaderFocus];
  [spy cleanReferences];
  NSUInteger baseline = spy.focusTargetQueryCount;
  [_rootController.view addSubview:spy];
  RNCEKVDrainMainQueue(1);

  XCTAssertEqual(spy.focusTargetQueryCount - baseline, 0u);
}

@end
