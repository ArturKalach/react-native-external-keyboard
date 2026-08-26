//
//  RNCEKVLockViewTests.mm
//  ExternalKeyboardExampleTests
//

#import <UIKit/UIKit.h>
#import <XCTest/XCTest.h>
#import <React/RCTUtils.h>

#import "UIViewController+RNCEKVExternalKeyboard.h"
#import "RNCEKVExternalKeyboardLockView.h"
#import "RNCEKVTestSupport.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <react/renderer/components/RNExternalKeyboardViewSpec/Props.h>
#endif

#pragma mark - RNCEKVLockViewSpy

// Overrides the transition-gated focus requests without calling super, so
// setForceLock:/setLockDisabled: gating (becoming active, staying active,
// re-activating) can be asserted in isolation from what a real request
// would do (route through RNCEKVKeyboardFocusService, post an
// accessibility notification).
@interface RNCEKVLockViewSpy : RNCEKVExternalKeyboardLockView

@property (nonatomic, assign) NSUInteger requestFocusCount;
@property (nonatomic, assign) NSUInteger requestScreenReaderFocusCount;

@end

@implementation RNCEKVLockViewSpy

- (void)requestFocus {
  self.requestFocusCount += 1;
}

- (void)requestScreenReaderFocus {
  self.requestScreenReaderFocusCount += 1;
}

@end

#pragma mark - RNCEKVLockViewPropsSpy

// Counts setForceLock:/setLockDisabled: invocations while still calling
// super, so updateProps:oldProps: can be asserted to invoke the setter
// only when the incoming Fabric prop differs from the current ivar.
@interface RNCEKVLockViewPropsSpy : RNCEKVExternalKeyboardLockView

@property (nonatomic, assign) NSUInteger forceLockSetterCount;
@property (nonatomic, assign) NSUInteger lockDisabledSetterCount;

@end

@implementation RNCEKVLockViewPropsSpy

- (void)setForceLock:(BOOL)forceLock {
  self.forceLockSetterCount += 1;
  [super setForceLock:forceLock];
}

- (void)setLockDisabled:(BOOL)lockDisabled {
  self.lockDisabledSetterCount += 1;
  [super setLockDisabled:lockDisabled];
}

@end

#pragma mark - Detached window helper

// A UIWindow distinct from the host app's real key window, so a real
// (non-spy) lock view can resolve `reactViewController` without touching
// the app's actual view hierarchy. RCTKeyWindow() keeps returning the
// host app's window throughout, which is what the routing tests observe.
static UIWindow *RNCEKVMakeDetachedWindowWithRootViewController(void) {
  UIWindow *window = [[UIWindow alloc] initWithFrame:CGRectMake(0, 0, 100, 100)];
  window.rootViewController = [[UIViewController alloc] init];
  return window;
}

#pragma mark - Tests

@interface RNCEKVLockViewTests : XCTestCase
@end

@implementation RNCEKVLockViewTests

- (void)setUp {
  [super setUp];
  RNCEKVResetRootCustomFocusView();
}

- (void)tearDown {
  RNCEKVResetRootCustomFocusView();
  [super tearDown];
}

#pragma mark setForceLock: / setLockDisabled: transition gating

- (void)test_forceLock_offToOn_requestsFocusAndScreenReaderOnce {
  RNCEKVLockViewSpy *lockView = [[RNCEKVLockViewSpy alloc] initWithFrame:CGRectZero];

  lockView.forceLock = YES;

  XCTAssertEqual(lockView.requestFocusCount, 1u);
  XCTAssertEqual(lockView.requestScreenReaderFocusCount, 1u);
}

- (void)test_forceLock_repeatedYES_noReRequest {
  RNCEKVLockViewSpy *lockView = [[RNCEKVLockViewSpy alloc] initWithFrame:CGRectZero];

  lockView.forceLock = YES;
  lockView.forceLock = YES;

  XCTAssertEqual(lockView.requestFocusCount, 1u);
  XCTAssertEqual(lockView.requestScreenReaderFocusCount, 1u);
}

- (void)test_forceLock_whileDisabled_noRequest {
  RNCEKVLockViewSpy *lockView = [[RNCEKVLockViewSpy alloc] initWithFrame:CGRectZero];

  lockView.lockDisabled = YES;
  lockView.forceLock = YES;

  XCTAssertEqual(lockView.requestFocusCount, 0u);
  XCTAssertEqual(lockView.requestScreenReaderFocusCount, 0u);
}

- (void)test_lockDisabled_liftedWhileForceLocked_reRequests {
  RNCEKVLockViewSpy *lockView = [[RNCEKVLockViewSpy alloc] initWithFrame:CGRectZero];
  lockView.forceLock = YES;
  lockView.lockDisabled = YES;
  NSUInteger requestFocusCountBeforeLift = lockView.requestFocusCount;
  NSUInteger requestScreenReaderFocusCountBeforeLift = lockView.requestScreenReaderFocusCount;

  lockView.lockDisabled = NO;

  XCTAssertEqual(lockView.requestFocusCount, requestFocusCountBeforeLift + 1);
  XCTAssertEqual(lockView.requestScreenReaderFocusCount, requestScreenReaderFocusCountBeforeLift + 1);
}

- (void)test_lockDisabled_turnedOn_noRequest {
  RNCEKVLockViewSpy *lockView = [[RNCEKVLockViewSpy alloc] initWithFrame:CGRectZero];
  lockView.forceLock = YES;
  NSUInteger requestFocusCountAfterActivation = lockView.requestFocusCount;
  NSUInteger requestScreenReaderFocusCountAfterActivation = lockView.requestScreenReaderFocusCount;

  lockView.lockDisabled = YES;

  XCTAssertEqual(lockView.requestFocusCount, requestFocusCountAfterActivation);
  XCTAssertEqual(lockView.requestScreenReaderFocusCount, requestScreenReaderFocusCountAfterActivation);
}

#pragma mark requestFocus routing (real view)

- (void)test_requestFocus_realView_routesThroughService_toOwnWindowRoot {
  UIWindow *detachedWindow = RNCEKVMakeDetachedWindowWithRootViewController();
  detachedWindow.hidden = NO;
  RNCEKVExternalKeyboardLockView *lockView =
      [[RNCEKVExternalKeyboardLockView alloc] initWithFrame:CGRectMake(0, 0, 50, 50)];
  [detachedWindow.rootViewController.view addSubview:lockView];

  lockView.forceLock = YES;

  XCTAssertEqualObjects(detachedWindow.rootViewController.rncekvCustomFocusView, lockView);
  XCTAssertNil(RCTKeyWindow().rootViewController.rncekvCustomFocusView);

  detachedWindow.hidden = YES;
}

- (void)test_requestFocus_inactiveGate_noRouting {
  RNCEKVExternalKeyboardLockView *lockView =
      [[RNCEKVExternalKeyboardLockView alloc] initWithFrame:CGRectMake(0, 0, 50, 50)];
  lockView.lockDisabled = YES;

  UIWindow *detachedWindow = RNCEKVMakeDetachedWindowWithRootViewController();
  [detachedWindow.rootViewController.view addSubview:lockView];

  [lockView requestFocus];

  UIViewController *keyRootController = RCTKeyWindow().rootViewController;
  XCTAssertNotNil(keyRootController);
  XCTAssertNil(keyRootController.rncekvCustomFocusView);
}

#pragma mark shouldUpdateFocusInContext:

- (void)test_shouldUpdateFocus_forceLock_blocksMoveOutsideSubtree {
  RNCEKVLockViewSpy *lockView = [[RNCEKVLockViewSpy alloc] initWithFrame:CGRectZero];
  lockView.forceLock = YES;

  UIView *outsideView = [[UIView alloc] initWithFrame:CGRectZero];
  RNCEKVTestFocusContext *context = [RNCEKVTestFocusContext new];
  context.nextFocusedView = outsideView;

  // -shouldUpdateFocusInContext: is UIKit-declared with a _Nonnull-audited
  // UIFocusUpdateContext parameter, so the double needs an explicit cast
  // here (see RNCEKVTestFocusContext's header comment).
  XCTAssertFalse([lockView shouldUpdateFocusInContext:(UIFocusUpdateContext *)context]);
}

- (void)test_shouldUpdateFocus_noForceLock_allowsOutsideMove {
  RNCEKVLockViewSpy *lockView = [[RNCEKVLockViewSpy alloc] initWithFrame:CGRectZero];

  UIView *outsideView = [[UIView alloc] initWithFrame:CGRectZero];
  RNCEKVTestFocusContext *context = [RNCEKVTestFocusContext new];
  context.nextFocusedView = outsideView;

  XCTAssertTrue([lockView shouldUpdateFocusInContext:(UIFocusUpdateContext *)context]);
}

- (void)test_shouldUpdateFocus_lockDisabled_bypassesLock {
  RNCEKVLockViewSpy *lockView = [[RNCEKVLockViewSpy alloc] initWithFrame:CGRectZero];
  lockView.forceLock = YES;
  lockView.lockDisabled = YES;

  UIView *outsideView = [[UIView alloc] initWithFrame:CGRectZero];
  RNCEKVTestFocusContext *context = [RNCEKVTestFocusContext new];
  context.nextFocusedView = outsideView;

  XCTAssertTrue([lockView shouldUpdateFocusInContext:(UIFocusUpdateContext *)context]);
}

- (void)test_shouldUpdateFocus_insideMove_allowedUnderLock {
  RNCEKVLockViewSpy *lockView = [[RNCEKVLockViewSpy alloc] initWithFrame:CGRectZero];
  lockView.forceLock = YES;

  UIView *childView = [[UIView alloc] initWithFrame:CGRectZero];
  [lockView addSubview:childView];

  RNCEKVTestFocusContext *context = [RNCEKVTestFocusContext new];
  context.nextFocusedView = childView;

  XCTAssertTrue([lockView shouldUpdateFocusInContext:(UIFocusUpdateContext *)context]);
}

#pragma mark updateProps:oldProps:

#ifdef RCT_NEW_ARCH_ENABLED

- (void)test_updateProps_unchangedValues_settersNotInvoked {
  RNCEKVLockViewPropsSpy *lockView = [[RNCEKVLockViewPropsSpy alloc] initWithFrame:CGRectZero];

  auto changedProps = std::make_shared<facebook::react::ExternalKeyboardLockViewProps>();
  changedProps->forceLock = true;
  changedProps->lockDisabled = true;
  facebook::react::Props::Shared newProps = changedProps;
  facebook::react::Props::Shared oldProps =
      std::make_shared<const facebook::react::ExternalKeyboardLockViewProps>();

  [lockView updateProps:newProps oldProps:oldProps];

  XCTAssertEqual(lockView.forceLockSetterCount, 1u);
  XCTAssertEqual(lockView.lockDisabledSetterCount, 1u);

  auto sameProps = std::make_shared<facebook::react::ExternalKeyboardLockViewProps>();
  sameProps->forceLock = true;
  sameProps->lockDisabled = true;
  facebook::react::Props::Shared repeatedProps = sameProps;

  [lockView updateProps:repeatedProps oldProps:newProps];

  XCTAssertEqual(lockView.forceLockSetterCount, 1u);
  XCTAssertEqual(lockView.lockDisabledSetterCount, 1u);
}

#endif /* RCT_NEW_ARCH_ENABLED */

#pragma mark dealloc

- (void)test_dealloc_removesNotificationObserver_noCrash {
  __weak RNCEKVExternalKeyboardLockView *weakLockView;
  @autoreleasepool {
    RNCEKVExternalKeyboardLockView *lockView =
        [[RNCEKVExternalKeyboardLockView alloc] initWithFrame:CGRectZero];
    UIView *container = [[UIView alloc] initWithFrame:CGRectZero];
    [container addSubview:lockView];
    weakLockView = lockView;
  }
  XCTAssertNil(weakLockView);

  [[NSNotificationCenter defaultCenter] postNotificationName:UIAccessibilityElementFocusedNotification
                                                       object:nil
                                                     userInfo:@{}];

  XCTAssertNil(weakLockView, @"posting after dealloc must not resurrect or crash");
}

@end
