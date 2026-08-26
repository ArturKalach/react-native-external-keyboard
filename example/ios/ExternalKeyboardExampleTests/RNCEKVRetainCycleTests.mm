//
//  RNCEKVRetainCycleTests.mm
//  ExternalKeyboardExampleTests
//

#import <UIKit/UIKit.h>
#import <XCTest/XCTest.h>

#import "RNCEKVExternalKeyboardView.h"
#import "RNCEKVTextInputFocusWrapper.h"
#import "RNCEKVExternalKeyboardLockView.h"
#import "RNCEKVFocusDelegate.h"
#import "RNCEKVFocusLinkDelegate.h"
#import "RNCEKVFocusSequenceDelegate.h"
#import "RNCEKVGroupIdentifierDelegate.h"
#import "RNCEKVGroupIdentifierProtocol.h"
#import "RNCEKVHaloDelegate.h"
#import "RNCEKVHaloProtocol.h"
#import "RNCEKVOrderRelationship.h"

#import "RNCEKVTestSupport.h"

#pragma mark - Host doubles outside RNCEKVTestSupport's coverage

// RNCEKVTestSupport doubles RNCEKVFocusProtocol and RNCEKVFocusOrderProtocol hosts
// only. RNCEKVGroupIdentifierDelegate and RNCEKVHaloDelegate need hosts for their own
// protocols, so those two doubles are file-local per the test plan.

@interface RNCEKVGroupIdHostDouble : UIView <RNCEKVGroupIdentifierProtocol>
@property (nonatomic, copy) NSString *customGroupId;
@end

@implementation RNCEKVGroupIdHostDouble
- (UIView *)getFocusTargetView {
  return self;
}
@end

@interface RNCEKVHaloHostDouble : UIView <RNCEKVHaloProtocol>
@property (nonatomic, assign) BOOL isHaloHidden;
@property (nonatomic, assign) CGFloat haloCornerRadius;
@property (nonatomic, assign) CGFloat haloExpendX;
@property (nonatomic, assign) CGFloat haloExpendY;
@property (nonatomic, assign) BOOL roundedHaloFix;
@end

@implementation RNCEKVHaloHostDouble
- (UIView *)getFocusTargetView {
  return self;
}
@end

@interface RNCEKVRetainCycleTests : XCTestCase
@end

@implementation RNCEKVRetainCycleTests

- (void)setUp {
  [super setUp];
  RNCEKVResetRootCustomFocusView();
}

- (void)tearDown {
  RNCEKVResetRootCustomFocusView();
  [super tearDown];
}

- (void)test_externalKeyboardView_deallocates_noDelegateCycle {
  __weak RNCEKVExternalKeyboardView *weakView;
  @autoreleasepool {
    RNCEKVExternalKeyboardView *view = [[RNCEKVExternalKeyboardView alloc] initWithFrame:CGRectZero];
    weakView = view;
  }
  XCTAssertNil(weakView);
}

- (void)test_textInputFocusWrapper_deallocates {
  __weak RNCEKVTextInputFocusWrapper *weakWrapper;
  @autoreleasepool {
    RNCEKVTextInputFocusWrapper *wrapper = [[RNCEKVTextInputFocusWrapper alloc] initWithFrame:CGRectZero];
    weakWrapper = wrapper;
  }
  XCTAssertNil(weakWrapper);
}

- (void)test_eachDelegate_survivesHostDealloc_lateCallsSafe {
  {
    __weak RNCEKVFocusHostDouble *weakHost;
    RNCEKVFocusDelegate *delegate;
    @autoreleasepool {
      RNCEKVFocusHostDouble *host = [[RNCEKVFocusHostDouble alloc] initWithFrame:CGRectZero];
      host.canBeFocused = YES;
      host.focusableWrapper = NO;
      weakHost = host;
      delegate = [[RNCEKVFocusDelegate alloc] initWithView:host];
    }
    XCTAssertNil(weakHost);
    XCTAssertNoThrow([delegate getFocusingView]);
    XCTAssertNil([delegate getFocusingView]);
    XCTAssertNoThrow([delegate canBecomeFocused]);
    XCTAssertFalse([delegate canBecomeFocused]);
  }

  {
    __weak RNCEKVOrderHostDouble *weakHost;
    RNCEKVFocusSequenceDelegate *delegate;
    @autoreleasepool {
      RNCEKVOrderHostDouble *host = [[RNCEKVOrderHostDouble alloc] initWithFrame:CGRectZero];
      weakHost = host;
      delegate = [[RNCEKVFocusSequenceDelegate alloc] initWithView:host];
    }
    XCTAssertNil(weakHost);
    UIFocusUpdateContext *context = (UIFocusUpdateContext *)[RNCEKVTestFocusContext new];
    XCTAssertNoThrow([delegate shouldUpdateFocusInContext:context]);
    XCTAssertNil([delegate shouldUpdateFocusInContext:context]);
  }

  {
    __weak RNCEKVOrderHostDouble *weakHost;
    RNCEKVFocusLinkDelegate *delegate;
    @autoreleasepool {
      RNCEKVOrderHostDouble *host = [[RNCEKVOrderHostDouble alloc] initWithFrame:CGRectZero];
      weakHost = host;
      delegate = [[RNCEKVFocusLinkDelegate alloc] initWithView:host];
    }
    XCTAssertNil(weakHost);
    UIFocusUpdateContext *context = (UIFocusUpdateContext *)[RNCEKVTestFocusContext new];
    XCTAssertNoThrow([delegate shouldUpdateFocusInContext:context]);
    XCTAssertNil([delegate shouldUpdateFocusInContext:context]);
  }

  {
    __weak RNCEKVGroupIdHostDouble *weakHost;
    RNCEKVGroupIdentifierDelegate *delegate;
    @autoreleasepool {
      RNCEKVGroupIdHostDouble *host = [[RNCEKVGroupIdHostDouble alloc] initWithFrame:CGRectZero];
      weakHost = host;
      delegate = [[RNCEKVGroupIdentifierDelegate alloc] initWithView:host];
    }
    XCTAssertNil(weakHost);
    NSString *identifier = nil;
    XCTAssertNoThrow(identifier = delegate.focusGroupIdentifier);
    XCTAssertNotNil(identifier);
  }

  if (@available(iOS 15.0, *)) {
    __weak RNCEKVHaloHostDouble *weakHost;
    RNCEKVHaloDelegate *delegate;
    @autoreleasepool {
      RNCEKVHaloHostDouble *host = [[RNCEKVHaloHostDouble alloc] initWithFrame:CGRectZero];
      weakHost = host;
      delegate = [[RNCEKVHaloDelegate alloc] initWithView:host];
    }
    XCTAssertNil(weakHost);
    UIFocusEffect *effect = nil;
    XCTAssertNoThrow(effect = delegate.focusEffect);
    XCTAssertNil(effect);
  }
}

- (void)test_orderRelationship_entryExit_zeroOnDealloc {
  RNCEKVOrderRelationship *relationship = [[RNCEKVOrderRelationship alloc] init];
  __weak UIView *weakEntry;
  __weak UIView *weakExit;
  @autoreleasepool {
    UIView *entry = [[UIView alloc] initWithFrame:CGRectZero];
    UIView *exit = [[UIView alloc] initWithFrame:CGRectZero];
    relationship.entry = entry;
    relationship.exit = exit;
    weakEntry = entry;
    weakExit = exit;
  }
  XCTAssertNil(weakEntry);
  XCTAssertNil(weakExit);
  XCTAssertNil(relationship.entry);
  XCTAssertNil(relationship.exit);
}

- (void)test_lockView_deallocates {
  __weak RNCEKVExternalKeyboardLockView *weakLockView;
  @autoreleasepool {
    RNCEKVExternalKeyboardLockView *lockView = [[RNCEKVExternalKeyboardLockView alloc] initWithFrame:CGRectZero];
    UIWindow *window = [[UIWindow alloc] initWithFrame:CGRectMake(0, 0, 100, 100)];
    [window addSubview:lockView];
    [lockView removeFromSuperview];
    weakLockView = lockView;
  }
  XCTAssertNil(weakLockView);
}

@end
