//
//  RNCEKVTestSupport.mm
//  ExternalKeyboardExampleTests
//

#import "RNCEKVTestSupport.h"

#import <XCTest/XCTest.h>
#import <React/RCTUtils.h>
#import "UIViewController+RNCEKVExternalKeyboard.h"

#pragma mark - RNCEKVTestFocusContext

@implementation RNCEKVTestFocusContext

// No custom -init: this is a plain NSObject double (see the header comment
// for why it does not subclass UIFocusUpdateContext), so the inherited
// NSObject default is sufficient; the suite constructs it with plain
// [RNCEKVTestFocusContext new].
@synthesize nextFocusedView = _nextFocusedView;
@synthesize previouslyFocusedView = _previouslyFocusedView;
@synthesize nextFocusedItem = _nextFocusedItem;
@synthesize previouslyFocusedItem = _previouslyFocusedItem;
@synthesize focusHeading = _focusHeading;

@end

#pragma mark - RNCEKVFocusHostDouble

@implementation RNCEKVFocusHostDouble
@end

#pragma mark - RNCEKVOrderHostDouble

@implementation RNCEKVOrderHostDouble

@synthesize orderGroup = _orderGroup;
@synthesize lockFocus = _lockFocus;
@synthesize orderPosition = _orderPosition;
@synthesize orderLeft = _orderLeft;
@synthesize orderRight = _orderRight;
@synthesize orderUp = _orderUp;
@synthesize orderDown = _orderDown;
@synthesize orderForward = _orderForward;
@synthesize orderBackward = _orderBackward;
@synthesize orderLast = _orderLast;
@synthesize orderFirst = _orderFirst;
@synthesize orderId = _orderId;

- (UIView *)getFocusTargetView {
  return self;
}

@end

#pragma mark - RNCEKVFocusableItemDouble

@implementation RNCEKVFocusableItemDouble

- (void)focus {
  _focusCallCount += 1;
}

@end

#pragma mark - Shared helpers

void RNCEKVDrainMainQueue(NSUInteger cycles) {
  for (NSUInteger cycle = 0; cycle < cycles; cycle++) {
    XCTestExpectation *expectation =
        [[XCTestExpectation alloc] initWithDescription:@"RNCEKVDrainMainQueue"];
    dispatch_async(dispatch_get_main_queue(), ^{
      [expectation fulfill];
    });
    [XCTWaiter waitForExpectations:@[ expectation ] timeout:5.0];
  }
}

void RNCEKVResetRootCustomFocusView(void) {
  RCTKeyWindow().rootViewController.rncekvCustomFocusView = nil;
}
