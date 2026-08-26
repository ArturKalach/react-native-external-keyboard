//
//  RNCEKVFocusSequenceDelegateTests.mm
//  ExternalKeyboardExampleTests
//

#import <UIKit/UIKit.h>
#import <XCTest/XCTest.h>
#import <React/RCTUtils.h>

#import "RNCEKVFocusSequenceDelegate.h"
#import "RNCEKVOrderLinking.h"
#import "RNCEKVOrderRelationship.h"
#import "UIViewController+RNCEKVExternalKeyboard.h"
#import "RNCEKVTestSupport.h"

#pragma mark - RNCEKVSequenceDelegateSpy

// Overrides the two focus-routing exit points without calling super, so a
// test can assert which view a navigation decision targeted without driving
// RNCEKVKeyboardFocusService or the real UIKit focus engine.
@interface RNCEKVSequenceDelegateSpy : RNCEKVFocusSequenceDelegate

@property (nonatomic, strong) UIView *keyboardedFocusTarget;
@property (nonatomic, strong) UIView *defaultFocusTarget;
@property (nonatomic, assign) NSUInteger keyboardedFocusCallCount;
@property (nonatomic, assign) NSUInteger defaultFocusCallCount;

@end

@implementation RNCEKVSequenceDelegateSpy

- (void)keyboardedViewFocus:(UIView *)view {
  _keyboardedFocusTarget = view;
  _keyboardedFocusCallCount += 1;
}

- (void)defaultViewFocus:(UIView *)view {
  _defaultFocusTarget = view;
  _defaultFocusCallCount += 1;
}

@end

#pragma mark - RNCEKVFocusSequenceDelegateTests

@interface RNCEKVFocusSequenceDelegateTests : XCTestCase
@end

@implementation RNCEKVFocusSequenceDelegateTests {
  NSMutableArray<NSArray *> *_registrations;
  NSMutableArray<UIWindow *> *_windows;
}

- (void)setUp {
  [super setUp];
  RNCEKVResetRootCustomFocusView();
  _registrations = [NSMutableArray array];
  _windows = [NSMutableArray array];
}

- (void)tearDown {
  for (NSArray *registration in _registrations) {
    [[RNCEKVOrderLinking sharedInstance] remove:registration[0] withOrderKey:registration[1]];
  }
  RNCEKVResetRootCustomFocusView();
  [super tearDown];
}

#pragma mark - Helpers

- (NSString *)uniqueOrderGroup {
  return [NSUUID UUID].UUIDString;
}

- (RNCEKVOrderHostDouble *)hostWithGroup:(NSString *)group position:(NSNumber *)position {
  RNCEKVOrderHostDouble *host = [[RNCEKVOrderHostDouble alloc] initWithFrame:CGRectZero];
  host.orderGroup = group;
  host.orderPosition = position;
  return host;
}

- (RNCEKVFocusableItemDouble *)registerItemAtPosition:(NSNumber *)position group:(NSString *)group {
  RNCEKVFocusableItemDouble *item = [[RNCEKVFocusableItemDouble alloc] initWithFrame:CGRectZero];
  [[RNCEKVOrderLinking sharedInstance] add:position withOrderKey:group withObject:item];
  [_registrations addObject:@[ position, group ]];
  return item;
}

- (UIView *)viewInWindow {
  UIWindow *window = [[UIWindow alloc] initWithFrame:CGRectMake(0, 0, 100, 100)];
  UIView *view = [[UIView alloc] initWithFrame:CGRectZero];
  [window addSubview:view];
  [_windows addObject:window];
  return view;
}

// Returns UIFocusUpdateContext* (not RNCEKVTestFocusContext*) — see
// RNCEKVTestFocusContext's header comment for why the double isn't a real
// UIFocusUpdateContext subclass and needs the cast below.
- (UIFocusUpdateContext *)contextWithPrevious:(id<UIFocusItem>)previous
                                          next:(id<UIFocusItem>)next
                                       heading:(UIFocusHeading)heading {
  RNCEKVTestFocusContext *context = [RNCEKVTestFocusContext new];
  context.previouslyFocusedItem = previous;
  context.nextFocusedItem = next;
  context.focusHeading = heading;
  return (UIFocusUpdateContext *)context;
}

#pragma mark - handleNextFocus: entry / boundary / middle / no-exit

- (void)test_entryView_next_focusesFirstItem_returnsHandled {
  NSString *group = [self uniqueOrderGroup];
  RNCEKVFocusableItemDouble *item0 = [self registerItemAtPosition:@0 group:group];
  UIView *entry = [self viewInWindow];

  RNCEKVOrderRelationship *relationship = [[RNCEKVOrderLinking sharedInstance] getInfo:group];
  relationship.entry = entry;

  RNCEKVOrderHostDouble *host = [self hostWithGroup:group position:@0];
  RNCEKVSequenceDelegateSpy *spy = [[RNCEKVSequenceDelegateSpy alloc] initWithView:host];

  BOOL handled = [spy handleNextFocus:entry currentIndex:-1 orderRelationship:relationship];

  XCTAssertTrue(handled);
  XCTAssertEqualObjects(spy.keyboardedFocusTarget, item0);

  NSNumber *result = [spy shouldUpdateFocusInContext:[self contextWithPrevious:entry
                                                                            next:nil
                                                                         heading:UIFocusHeadingNext]];

  XCTAssertEqualObjects(result, @0);
}

- (void)test_lastItem_next_withExit_routesToExit {
  NSString *group = [self uniqueOrderGroup];
  [self registerItemAtPosition:@0 group:group];
  RNCEKVFocusableItemDouble *item1 = [self registerItemAtPosition:@1 group:group];
  UIView *exit = [self viewInWindow];

  RNCEKVOrderRelationship *relationship = [[RNCEKVOrderLinking sharedInstance] getInfo:group];
  relationship.exit = exit;

  RNCEKVOrderHostDouble *host = [self hostWithGroup:group position:@0];
  RNCEKVSequenceDelegateSpy *spy = [[RNCEKVSequenceDelegateSpy alloc] initWithView:host];

  BOOL handled = [spy handleNextFocus:item1 currentIndex:1 orderRelationship:relationship];

  XCTAssertTrue(handled);
  XCTAssertEqualObjects(spy.defaultFocusTarget, exit);
  XCTAssertNil(spy.keyboardedFocusTarget);
}

- (void)test_middleItem_next_focusesNextItem {
  NSString *group = [self uniqueOrderGroup];
  RNCEKVFocusableItemDouble *item0 = [self registerItemAtPosition:@0 group:group];
  RNCEKVFocusableItemDouble *item1 = [self registerItemAtPosition:@1 group:group];
  [self registerItemAtPosition:@2 group:group];

  RNCEKVOrderRelationship *relationship = [[RNCEKVOrderLinking sharedInstance] getInfo:group];
  RNCEKVOrderHostDouble *host = [self hostWithGroup:group position:@0];
  RNCEKVSequenceDelegateSpy *spy = [[RNCEKVSequenceDelegateSpy alloc] initWithView:host];

  BOOL handled = [spy handleNextFocus:item0 currentIndex:0 orderRelationship:relationship];

  XCTAssertTrue(handled);
  XCTAssertEqualObjects(spy.keyboardedFocusTarget, item1);
}

- (void)test_lastItem_next_withoutExit_returnsNO_noFocus {
  NSString *group = [self uniqueOrderGroup];
  [self registerItemAtPosition:@0 group:group];
  RNCEKVFocusableItemDouble *item1 = [self registerItemAtPosition:@1 group:group];

  RNCEKVOrderRelationship *relationship = [[RNCEKVOrderLinking sharedInstance] getInfo:group];
  RNCEKVOrderHostDouble *host = [self hostWithGroup:group position:@0];
  RNCEKVSequenceDelegateSpy *spy = [[RNCEKVSequenceDelegateSpy alloc] initWithView:host];

  BOOL handled = [spy handleNextFocus:item1 currentIndex:1 orderRelationship:relationship];

  XCTAssertFalse(handled);
  XCTAssertEqual(spy.keyboardedFocusCallCount, (NSUInteger)0);
  XCTAssertEqual(spy.defaultFocusCallCount, (NSUInteger)0);
}

#pragma mark - shouldUpdateFocusInContext: stale entry/exit revalidation

- (void)test_staleEntry_windowless_clearedAndRecaptured {
  NSString *group = [self uniqueOrderGroup];
  [self registerItemAtPosition:@0 group:group];

  RNCEKVOrderRelationship *relationship = [[RNCEKVOrderLinking sharedInstance] getInfo:group];
  UIView *staleEntry = [[UIView alloc] initWithFrame:CGRectZero];
  relationship.entry = staleEntry;

  RNCEKVOrderHostDouble *host = [self hostWithGroup:group position:@0];
  RNCEKVSequenceDelegateSpy *spy = [[RNCEKVSequenceDelegateSpy alloc] initWithView:host];

  UIView *outsideC = [[UIView alloc] initWithFrame:CGRectZero];
  [spy shouldUpdateFocusInContext:[self contextWithPrevious:outsideC next:nil heading:UIFocusHeadingNext]];

  XCTAssertEqualObjects(relationship.entry, outsideC);
}

- (void)test_staleExit_windowless_cleared {
  NSString *group = [self uniqueOrderGroup];
  RNCEKVFocusableItemDouble *item0 = [self registerItemAtPosition:@0 group:group];

  RNCEKVOrderRelationship *relationship = [[RNCEKVOrderLinking sharedInstance] getInfo:group];
  UIView *staleExit = [[UIView alloc] initWithFrame:CGRectZero];
  relationship.exit = staleExit;

  RNCEKVOrderHostDouble *host = [self hostWithGroup:group position:@0];
  RNCEKVSequenceDelegateSpy *spy = [[RNCEKVSequenceDelegateSpy alloc] initWithView:host];

  UIView *outsideD = [[UIView alloc] initWithFrame:CGRectZero];
  [spy shouldUpdateFocusInContext:[self contextWithPrevious:item0 next:outsideD heading:UIFocusHeadingNext]];

  XCTAssertEqualObjects(relationship.exit, outsideD);
}

- (void)test_liveEntry_inWindow_notCleared_notOverwritten {
  NSString *group = [self uniqueOrderGroup];
  [self registerItemAtPosition:@0 group:group];

  RNCEKVOrderRelationship *relationship = [[RNCEKVOrderLinking sharedInstance] getInfo:group];
  UIView *liveEntry = [self viewInWindow];
  relationship.entry = liveEntry;

  RNCEKVOrderHostDouble *host = [self hostWithGroup:group position:@0];
  RNCEKVSequenceDelegateSpy *spy = [[RNCEKVSequenceDelegateSpy alloc] initWithView:host];

  UIView *outsideB = [[UIView alloc] initWithFrame:CGRectZero];
  [spy shouldUpdateFocusInContext:[self contextWithPrevious:outsideB next:nil heading:UIFocusHeadingNext]];

  XCTAssertEqualObjects(relationship.entry, liveEntry);
}

#pragma mark - defaultViewFocus: real routing

- (void)test_defaultViewFocus_routesThroughService_toRootController {
  NSString *group = [self uniqueOrderGroup];
  RNCEKVOrderHostDouble *host = [self hostWithGroup:group position:@0];
  RNCEKVFocusSequenceDelegate *delegate = [[RNCEKVFocusSequenceDelegate alloc] initWithView:host];

  UIView *target = [[UIView alloc] initWithFrame:CGRectZero];
  [delegate defaultViewFocus:target];

  XCTAssertEqualObjects(RCTKeyWindow().rootViewController.rncekvCustomFocusView, target);
}

#pragma mark - shouldUpdateFocusInContext: previous heading and empty group

- (void)test_previousHeading_middleItem_focusesPreviousItem_handled {
  NSString *group = [self uniqueOrderGroup];
  RNCEKVFocusableItemDouble *item0 = [self registerItemAtPosition:@0 group:group];
  RNCEKVFocusableItemDouble *item1 = [self registerItemAtPosition:@1 group:group];

  RNCEKVOrderHostDouble *host = [self hostWithGroup:group position:@0];
  RNCEKVSequenceDelegateSpy *spy = [[RNCEKVSequenceDelegateSpy alloc] initWithView:host];

  NSNumber *result = [spy shouldUpdateFocusInContext:[self contextWithPrevious:item1
                                                                            next:nil
                                                                         heading:UIFocusHeadingPrevious]];

  XCTAssertEqualObjects(result, @0);
  XCTAssertEqualObjects(spy.keyboardedFocusTarget, item0);
}

- (void)test_emptyGroup_returnsDefault {
  NSString *group = [self uniqueOrderGroup];
  RNCEKVOrderHostDouble *host = [self hostWithGroup:group position:@0];
  RNCEKVSequenceDelegateSpy *spy = [[RNCEKVSequenceDelegateSpy alloc] initWithView:host];

  UIView *previous = [[UIView alloc] initWithFrame:CGRectZero];
  UIView *next = [[UIView alloc] initWithFrame:CGRectZero];
  NSNumber *result = [spy shouldUpdateFocusInContext:[self contextWithPrevious:previous
                                                                            next:next
                                                                         heading:UIFocusHeadingNext]];

  XCTAssertNil(result);
  XCTAssertNil([[RNCEKVOrderLinking sharedInstance] getInfo:group]);
}

#pragma mark - RNCEKVOrderRelationship.clear endpoint cleanup

- (void)test_relationshipClear_nilsEntryAndExit {
  RNCEKVOrderRelationship *relationship = [RNCEKVOrderRelationship new];
  relationship.entry = [self viewInWindow];
  relationship.exit = [self viewInWindow];

  [relationship clear];

  XCTAssertNil(relationship.entry);
  XCTAssertNil(relationship.exit);
  XCTAssertEqual([relationship count], 0);
}

- (void)test_lastMemberRemoved_clearsEndpoints {
  NSString *group = [self uniqueOrderGroup];
  [self registerItemAtPosition:@0 group:group];

  RNCEKVOrderRelationship *relationship = [[RNCEKVOrderLinking sharedInstance] getInfo:group];
  relationship.entry = [self viewInWindow];
  relationship.exit = [self viewInWindow];

  [[RNCEKVOrderLinking sharedInstance] remove:@0 withOrderKey:group];

  XCTAssertNil(relationship.entry, @"emptying the group clears its endpoints");
  XCTAssertNil(relationship.exit);
  XCTAssertNil([[RNCEKVOrderLinking sharedInstance] getInfo:group]);
}

@end
