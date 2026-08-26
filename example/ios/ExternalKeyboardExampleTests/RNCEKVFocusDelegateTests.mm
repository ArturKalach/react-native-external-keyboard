//
//  RNCEKVFocusDelegateTests.mm
//  ExternalKeyboardExampleTests
//

#import <UIKit/UIKit.h>
#import <XCTest/XCTest.h>

#import "RNCEKVFocusDelegate.h"
#import "RNCEKVTestSupport.h"

@interface RNCEKVFocusDelegateTests : XCTestCase
@end

@implementation RNCEKVFocusDelegateTests

- (void)setUp {
  [super setUp];
  RNCEKVResetRootCustomFocusView();
}

- (void)tearDown {
  RNCEKVResetRootCustomFocusView();
  [super tearDown];
}

- (RNCEKVFocusHostDouble *)hostWithFocusableWrapper:(BOOL)focusableWrapper {
  RNCEKVFocusHostDouble *host = [[RNCEKVFocusHostDouble alloc] initWithFrame:CGRectZero];
  host.focusableWrapper = focusableWrapper;
  return host;
}

// Returns UIFocusUpdateContext* (not RNCEKVTestFocusContext*): callers pass
// this straight into -isFocusChanged:, whose declared parameter type this
// double is not a real subclass of (see RNCEKVTestFocusContext's header
// comment) — the cast keeps every call site's static type correct.
- (UIFocusUpdateContext *)contextWithNext:(UIView *)next previous:(UIView *)previous {
  RNCEKVTestFocusContext *context = [RNCEKVTestFocusContext new];
  context.nextFocusedView = next;
  context.previouslyFocusedView = previous;
  return (UIFocusUpdateContext *)context;
}

- (void)test_focusEnter_nonWrapper_reportsYes {
  RNCEKVFocusHostDouble *host = [self hostWithFocusableWrapper:NO];
  RNCEKVFocusDelegate *delegate = [[RNCEKVFocusDelegate alloc] initWithView:host];

  UIFocusUpdateContext *context = [self contextWithNext:host previous:nil];

  XCTAssertEqualObjects([delegate isFocusChanged:context], @YES);
  XCTAssertNil([delegate isFocusChanged:context]);
}

- (void)test_wrapper_firstEntry_yes_secondDescendantEntry_nil_andRetargets {
  RNCEKVFocusHostDouble *host = [self hostWithFocusableWrapper:YES];
  UIView *child1 = [[UIView alloc] initWithFrame:CGRectZero];
  UIView *child2 = [[UIView alloc] initWithFrame:CGRectZero];
  [host addSubview:child1];
  [host addSubview:child2];
  RNCEKVFocusDelegate *delegate = [[RNCEKVFocusDelegate alloc] initWithView:host];

  UIFocusUpdateContext *firstEntry = [self contextWithNext:child1 previous:nil];
  XCTAssertEqualObjects([delegate isFocusChanged:firstEntry], @YES);

  UIFocusUpdateContext *secondEntry = [self contextWithNext:child2 previous:child1];
  XCTAssertNil([delegate isFocusChanged:secondEntry]);

  XCTAssertEqualObjects([delegate getFocusingView], child2);
}

- (void)test_focusLeave_reportsNo {
  RNCEKVFocusHostDouble *host = [self hostWithFocusableWrapper:NO];
  RNCEKVFocusDelegate *delegate = [[RNCEKVFocusDelegate alloc] initWithView:host];
  [delegate isFocusChanged:[self contextWithNext:host previous:nil]];

  UIView *outside = [[UIView alloc] initWithFrame:CGRectZero];
  UIFocusUpdateContext *leave = [self contextWithNext:outside previous:host];

  XCTAssertEqualObjects([delegate isFocusChanged:leave], @NO);
}

- (void)test_trackedTargetDeallocated_blurStillReported {
  RNCEKVFocusHostDouble *host = [self hostWithFocusableWrapper:YES];
  RNCEKVFocusDelegate *delegate = [[RNCEKVFocusDelegate alloc] initWithView:host];

  __weak UIView *weakChild;
  @autoreleasepool {
    UIView *child = [[UIView alloc] initWithFrame:CGRectZero];
    [host addSubview:child];
    weakChild = child;

    [delegate isFocusChanged:[self contextWithNext:child previous:nil]];
    [child removeFromSuperview];
  }
  XCTAssertNil(weakChild);

  UIView *other = [[UIView alloc] initWithFrame:CGRectZero];
  UIView *outside = [[UIView alloc] initWithFrame:CGRectZero];
  UIFocusUpdateContext *afterDealloc = [self contextWithNext:outside previous:other];

  XCTAssertEqualObjects([delegate isFocusChanged:afterDealloc], @NO);
}

- (void)test_secondUnrelatedContext_afterBlur_returnsNil {
  RNCEKVFocusHostDouble *host = [self hostWithFocusableWrapper:NO];
  RNCEKVFocusDelegate *delegate = [[RNCEKVFocusDelegate alloc] initWithView:host];
  [delegate isFocusChanged:[self contextWithNext:host previous:nil]];

  UIView *outside = [[UIView alloc] initWithFrame:CGRectZero];
  XCTAssertEqualObjects([delegate isFocusChanged:[self contextWithNext:outside previous:host]], @NO);

  UIView *unrelatedNext = [[UIView alloc] initWithFrame:CGRectZero];
  UIView *unrelatedPrev = [[UIView alloc] initWithFrame:CGRectZero];
  UIFocusUpdateContext *unrelated = [self contextWithNext:unrelatedNext previous:unrelatedPrev];

  XCTAssertNil([delegate isFocusChanged:unrelated]);
}

- (void)test_reset_clearsTracking {
  RNCEKVFocusHostDouble *host = [self hostWithFocusableWrapper:NO];
  RNCEKVFocusDelegate *delegate = [[RNCEKVFocusDelegate alloc] initWithView:host];
  [delegate isFocusChanged:[self contextWithNext:host previous:nil]];

  [delegate reset];

  UIView *unrelatedNext = [[UIView alloc] initWithFrame:CGRectZero];
  UIView *unrelatedPrev = [[UIView alloc] initWithFrame:CGRectZero];
  UIFocusUpdateContext *unrelated = [self contextWithNext:unrelatedNext previous:unrelatedPrev];

  XCTAssertNil([delegate isFocusChanged:unrelated]);
}

- (void)test_unrelatedContext_beforeAnyFocus_returnsNil {
  RNCEKVFocusHostDouble *host = [self hostWithFocusableWrapper:NO];
  RNCEKVFocusDelegate *delegate = [[RNCEKVFocusDelegate alloc] initWithView:host];

  UIView *unrelatedNext = [[UIView alloc] initWithFrame:CGRectZero];
  UIView *unrelatedPrev = [[UIView alloc] initWithFrame:CGRectZero];
  UIFocusUpdateContext *unrelated = [self contextWithNext:unrelatedNext previous:unrelatedPrev];

  XCTAssertNil([delegate isFocusChanged:unrelated]);
}

@end
