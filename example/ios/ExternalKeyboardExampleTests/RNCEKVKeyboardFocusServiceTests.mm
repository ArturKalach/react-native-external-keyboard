//
//  RNCEKVKeyboardFocusServiceTests.mm
//  ExternalKeyboardExampleTests
//

#import <XCTest/XCTest.h>
#import <React/RCTUtils.h>

#import "RNCEKVKeyboardFocusService.h"
#import "UIViewController+RNCEKVExternalKeyboard.h"
#import "RNCEKVTestSupport.h"

@interface RNCEKVKeyboardFocusServiceTests : XCTestCase
@end

@implementation RNCEKVKeyboardFocusServiceTests

- (void)setUp {
  [super setUp];
  RNCEKVResetRootCustomFocusView();
}

- (void)tearDown {
  RNCEKVResetRootCustomFocusView();
  [super tearDown];
}

- (void)test_focusNil_preservesExistingCustomFocusView {
  UIViewController *rootController = RCTKeyWindow().rootViewController;
  XCTAssertNotNil(rootController);

  UIView *existingFocusView = [UIView new];
  rootController.rncekvCustomFocusView = existingFocusView;
  UIViewController *fallbackController = [UIViewController new];

  [RNCEKVKeyboardFocusService focus:nil withFallback:fallbackController];

  XCTAssertEqual(rootController.rncekvCustomFocusView, existingFocusView);
}

- (void)test_focus_prefersKeyWindowRoot_overFallback {
  UIViewController *rootController = RCTKeyWindow().rootViewController;
  XCTAssertNotNil(rootController);

  UIViewController *fallbackController = [UIViewController new];
  UIView *focusTarget = [UIView new];

  [RNCEKVKeyboardFocusService focus:focusTarget withFallback:fallbackController];

  XCTAssertEqual(rootController.rncekvCustomFocusView, focusTarget);
  XCTAssertNil(fallbackController.rncekvCustomFocusView);
}

- (void)test_focusWrapper_delegatesToFallbackVariant {
  UIViewController *rootController = RCTKeyWindow().rootViewController;
  XCTAssertNotNil(rootController);

  UIView *focusTarget = [UIView new];

  [RNCEKVKeyboardFocusService focus:focusTarget];

  XCTAssertEqual(rootController.rncekvCustomFocusView, focusTarget);
}

@end
