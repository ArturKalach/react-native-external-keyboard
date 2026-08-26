//
//  RNCEKVFocusChangeEventTests.mm
//  ExternalKeyboardExampleTests
//

#import <UIKit/UIKit.h>
#import <XCTest/XCTest.h>

#import "RNCEKVExternalKeyboardView.h"
#import "RNCEKVTestSupport.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <objc/runtime.h>
#import "RNCEKVFabricEventHelper.h"
#endif

#pragma mark - RNCEKVFocusChangeEventRecordingView

// Records every -onFocusChangeHandler: argument before forwarding to super,
// so a test can assert the exact sequence of focus-change events the base
// class fired without a live focus engine or JS-side event wiring.
@interface RNCEKVFocusChangeEventRecordingView : RNCEKVExternalKeyboardView

@property (nonatomic, strong, readonly) NSArray<NSNumber *> *recordedFocusChanges;

@end

@implementation RNCEKVFocusChangeEventRecordingView {
  NSMutableArray<NSNumber *> *_focusChangeLog;
}

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    _focusChangeLog = [NSMutableArray array];
  }
  return self;
}

- (NSArray<NSNumber *> *)recordedFocusChanges {
  return [_focusChangeLog copy];
}

- (void)onFocusChangeHandler:(BOOL)isFocused {
  [_focusChangeLog addObject:@(isFocused)];
  [super onFocusChangeHandler:isFocused];
}

@end

#ifdef RCT_NEW_ARCH_ENABLED

#pragma mark - RNCEKVFabricEventHelper counting replacement

// Byte-identical C++ signature to +onFocusChangeEventEmmiter:withEmitter:,
// swapped in via method_exchangeImplementations so the leaf-gate tests can
// count invocations without constructing a real SharedViewEventEmitter.
// imp_implementationWithBlock is avoided here: it is ABI-delicate over a
// by-value std::shared_ptr parameter, while a compiled category preserves
// the C++ calling convention exactly.
@interface RNCEKVFabricEventHelper (RNCEKVFocusChangeEventCounting)

+ (void)rncekv_test_onFocusChangeEventEmmiter:(BOOL)isFocused
                                   withEmitter:(facebook::react::SharedViewEventEmitter)emitter;

@end

static NSUInteger sRNCEKVFocusChangeEmitCallCount;
static BOOL sRNCEKVFocusChangeEmitLastIsFocused;

@implementation RNCEKVFabricEventHelper (RNCEKVFocusChangeEventCounting)

+ (void)rncekv_test_onFocusChangeEventEmmiter:(BOOL)isFocused
                                   withEmitter:(facebook::react::SharedViewEventEmitter)emitter {
  sRNCEKVFocusChangeEmitCallCount += 1;
  sRNCEKVFocusChangeEmitLastIsFocused = isFocused;
}

@end

#endif /* RCT_NEW_ARCH_ENABLED */

#pragma mark - Tests

@interface RNCEKVFocusChangeEventTests : XCTestCase
@end

@implementation RNCEKVFocusChangeEventTests

#ifdef RCT_NEW_ARCH_ENABLED
- (void)swapFocusChangeEventEmitterImplementations {
  Method original = class_getClassMethod([RNCEKVFabricEventHelper class],
                                          @selector(onFocusChangeEventEmmiter:withEmitter:));
  Method replacement = class_getClassMethod([RNCEKVFabricEventHelper class],
                                             @selector(rncekv_test_onFocusChangeEventEmmiter:withEmitter:));
  method_exchangeImplementations(original, replacement);
}
#endif

- (void)setUp {
  [super setUp];
  RNCEKVResetRootCustomFocusView();
#ifdef RCT_NEW_ARCH_ENABLED
  sRNCEKVFocusChangeEmitCallCount = 0;
  sRNCEKVFocusChangeEmitLastIsFocused = NO;
  [self swapFocusChangeEventEmitterImplementations];
#endif
}

- (void)tearDown {
#ifdef RCT_NEW_ARCH_ENABLED
  [self swapFocusChangeEventEmitterImplementations];
#endif
  RNCEKVResetRootCustomFocusView();
  [super tearDown];
}

- (RNCEKVFocusChangeEventRecordingView *)recordingViewWithCanBeFocused:(BOOL)canBeFocused
                                                        focusableWrapper:(BOOL)focusableWrapper {
  RNCEKVFocusChangeEventRecordingView *view =
      [[RNCEKVFocusChangeEventRecordingView alloc] initWithFrame:CGRectZero];
  view.canBeFocused = canBeFocused;
  view.focusableWrapper = focusableWrapper;
  return view;
}

// Returns UIFocusUpdateContext* (not RNCEKVTestFocusContext*): the caller
// passes this straight into -didUpdateFocusInContext:withAnimationCoordinator:,
// a UIKit-declared method whose context parameter is _Nonnull-audited, so
// the compiler hard-errors on an unrelated-class argument unless it is
// already statically typed (or cast) to UIFocusUpdateContext* — see
// RNCEKVTestFocusContext's header comment for why the double isn't a real
// UIFocusUpdateContext subclass.
- (UIFocusUpdateContext *)contextWithNext:(nullable UIView *)next previous:(nullable UIView *)previous {
  RNCEKVTestFocusContext *context = [RNCEKVTestFocusContext new];
  context.nextFocusedView = next;
  context.previouslyFocusedView = previous;
  return (UIFocusUpdateContext *)context;
}

- (void)test_focusEnter_setsIsKeyboardFocused_firesHandlerYes {
  RNCEKVFocusChangeEventRecordingView *view = [self recordingViewWithCanBeFocused:YES focusableWrapper:NO];

  [view didUpdateFocusInContext:[self contextWithNext:view previous:nil]
        withAnimationCoordinator:(UIFocusAnimationCoordinator *)nil];

  XCTAssertEqualObjects(view.recordedFocusChanges, (@[@YES]));
  XCTAssertTrue(view.isKeyboardFocused);
}

- (void)test_unrelatedContext_preservesState_noHandlerCall {
  RNCEKVFocusChangeEventRecordingView *view = [self recordingViewWithCanBeFocused:YES focusableWrapper:NO];
  [view didUpdateFocusInContext:[self contextWithNext:view previous:nil]
        withAnimationCoordinator:(UIFocusAnimationCoordinator *)nil];

  UIView *unrelatedNext = [[UIView alloc] initWithFrame:CGRectZero];
  UIView *unrelatedPrevious = [[UIView alloc] initWithFrame:CGRectZero];

  [view didUpdateFocusInContext:[self contextWithNext:unrelatedNext previous:unrelatedPrevious]
        withAnimationCoordinator:(UIFocusAnimationCoordinator *)nil];

  XCTAssertEqualObjects(view.recordedFocusChanges, (@[@YES]));
  XCTAssertTrue(view.isKeyboardFocused);
}

- (void)test_focusLeave_firesHandlerNo {
  RNCEKVFocusChangeEventRecordingView *view = [self recordingViewWithCanBeFocused:YES focusableWrapper:NO];
  [view didUpdateFocusInContext:[self contextWithNext:view previous:nil]
        withAnimationCoordinator:(UIFocusAnimationCoordinator *)nil];

  UIView *outside = [[UIView alloc] initWithFrame:CGRectZero];
  [view didUpdateFocusInContext:[self contextWithNext:outside previous:view]
        withAnimationCoordinator:(UIFocusAnimationCoordinator *)nil];

  XCTAssertEqualObjects(view.recordedFocusChanges, (@[@YES, @NO]));
  XCTAssertFalse(view.isKeyboardFocused);
}

#ifdef RCT_NEW_ARCH_ENABLED

- (void)test_leafEmission_suppressedWithoutHasOnFocusChanged {
  RNCEKVExternalKeyboardView *view = [[RNCEKVExternalKeyboardView alloc] initWithFrame:CGRectZero];
  view.hasOnFocusChanged = NO;

  [view onFocusChangeHandler:YES];

  XCTAssertEqual(sRNCEKVFocusChangeEmitCallCount, 0u);
}

- (void)test_leafEmission_firesWithHasOnFocusChanged {
  RNCEKVExternalKeyboardView *view = [[RNCEKVExternalKeyboardView alloc] initWithFrame:CGRectZero];
  view.hasOnFocusChanged = YES;

  [view onFocusChangeHandler:YES];

  XCTAssertEqual(sRNCEKVFocusChangeEmitCallCount, 1u);
  XCTAssertTrue(sRNCEKVFocusChangeEmitLastIsFocused);
}

#endif /* RCT_NEW_ARCH_ENABLED */

@end
