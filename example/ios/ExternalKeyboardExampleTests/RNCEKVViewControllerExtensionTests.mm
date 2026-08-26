//
//  RNCEKVViewControllerExtensionTests.mm
//  ExternalKeyboardExampleTests
//

#import <UIKit/UIKit.h>
#import <XCTest/XCTest.h>

#import "UIViewController+RNCEKVExternalKeyboard.h"
#import "RNCEKVTestSupport.h"

@interface RNCEKVViewControllerExtensionTests : XCTestCase
@end

@implementation RNCEKVViewControllerExtensionTests

- (void)setUp {
  [super setUp];
  RNCEKVResetRootCustomFocusView();
}

- (void)tearDown {
  RNCEKVResetRootCustomFocusView();
  [super tearDown];
}

- (void)test_customFocusView_setGet_roundtrip {
  UIViewController *vc = [UIViewController new];
  UIView *view = [[UIView alloc] initWithFrame:CGRectZero];

  vc.rncekvCustomFocusView = view;
  XCTAssertEqualObjects(vc.rncekvCustomFocusView, view);

  vc.rncekvCustomFocusView = nil;
  XCTAssertNil(vc.rncekvCustomFocusView);
}

- (void)test_customFocusView_notRetained_zeroesAfterDealloc {
  UIViewController *vc = [UIViewController new];

  __weak UIView *weakView;
  @autoreleasepool {
    UIView *view = [[UIView alloc] initWithFrame:CGRectZero];
    weakView = view;
    vc.rncekvCustomFocusView = view;
    XCTAssertEqualObjects(vc.rncekvCustomFocusView, view);
  }

  XCTAssertNil(weakView);
  XCTAssertNil(vc.rncekvCustomFocusView);
}

- (void)test_preferredFocusEnvironments_noCustomView_passthrough {
  UIViewController *vc = [UIViewController new];

  NSArray<id<UIFocusEnvironment>> *first = vc.preferredFocusEnvironments;
  NSArray<id<UIFocusEnvironment>> *second = vc.preferredFocusEnvironments;

  XCTAssertEqualObjects(first, second);
  XCTAssertNil(vc.rncekvCustomFocusView);
}

- (void)test_preferredFocusEnvironments_viewInWindow_insertedFirst {
  UIViewController *vc = [UIViewController new];
  NSArray<id<UIFocusEnvironment>> *originalEnvironments = vc.preferredFocusEnvironments;

  UIWindow *window = [[UIWindow alloc] initWithFrame:CGRectMake(0, 0, 100, 100)];
  UIView *view = [[UIView alloc] initWithFrame:CGRectZero];
  [window addSubview:view];
  vc.rncekvCustomFocusView = view;

  NSArray<id<UIFocusEnvironment>> *result = vc.preferredFocusEnvironments;

  XCTAssertEqualObjects(result.firstObject, view);
  XCTAssertEqualObjects([result subarrayWithRange:NSMakeRange(1, result.count - 1)], originalEnvironments);
}

- (void)test_preferredFocusEnvironments_windowlessView_clearedAndPassthrough {
  UIViewController *vc = [UIViewController new];
  UIView *detachedView = [[UIView alloc] initWithFrame:CGRectZero];
  vc.rncekvCustomFocusView = detachedView;

  NSArray<id<UIFocusEnvironment>> *result = vc.preferredFocusEnvironments;

  XCTAssertFalse([result containsObject:detachedView]);
  XCTAssertNil(vc.rncekvCustomFocusView);
}

- (void)test_rncekvFocusView_setsHolderSynchronously_schedulesFocusUpdate {
  UIViewController *vc = [UIViewController new];
  UIView *view = [[UIView alloc] initWithFrame:CGRectZero];

  [vc rncekvFocusView:view];

  XCTAssertEqualObjects(vc.rncekvCustomFocusView, view);

  RNCEKVDrainMainQueue(1);
}

@end
