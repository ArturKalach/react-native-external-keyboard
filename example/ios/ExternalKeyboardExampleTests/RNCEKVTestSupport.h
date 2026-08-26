//
//  RNCEKVTestSupport.h
//  ExternalKeyboardExampleTests
//
//  Shared test doubles, a settable UIFocusUpdateContext stand-in, a
//  main-queue draining helper, and the no-implementation "Testing"
//  category declarations that expose private library methods to the
//  suite. Every other test file imports this header.
//

#ifndef RNCEKVTestSupport_h
#define RNCEKVTestSupport_h

#import <UIKit/UIKit.h>

#import "RNCEKVFocusProtocol.h"
#import "RNCEKVFocusOrderProtocol.h"
#import "RNCEKVKeyboardFocusableProtocol.h"
#import "RNCEKVFocusSequenceDelegate.h"
#import "RNCEKVOrderRelationship.h"
#import "RNCEKVViewOrderGroupBase.h"
#import "RNCEKVExternalKeyboardLockView.h"

NS_ASSUME_NONNULL_BEGIN

#pragma mark - Testing categories

// RNCEKVFocusSequenceDelegate's index-navigation and focus-routing methods
// are internal to the .mm and absent from the public header.
@interface RNCEKVFocusSequenceDelegate (Testing)

- (BOOL)handleNextFocus:(nullable UIView *)current
           currentIndex:(NSInteger)currentIndex
      orderRelationship:(RNCEKVOrderRelationship *)orderRelationship;

- (BOOL)handlePrevFocus:(nullable UIView *)current
           currentIndex:(NSInteger)currentIndex
      orderRelationship:(RNCEKVOrderRelationship *)orderRelationship;

- (void)defaultViewFocus:(UIView *)view;
- (void)keyboardedViewFocus:(UIView *)view;

@end

// RNCEKVViewOrderGroupBase's descendant-focus check is internal to the .mm
// and absent from the public header.
@interface RNCEKVViewOrderGroupBase (Testing)

- (BOOL)getIsViewFocused:(UIFocusUpdateContext *)context;

@end

// RNCEKVExternalKeyboardLockView's focus-routing methods are both private
// and absent from the public header.
@interface RNCEKVExternalKeyboardLockView (Testing)

- (void)requestFocus;
- (void)requestScreenReaderFocus;

@end

#pragma mark - RNCEKVTestFocusContext

// A UIFocusUpdateContext stand-in exposing the same next/previous focused
// view/item and focus heading accessors UIKit's real context declares
// read-only, so a test can drive isFocusChanged:/shouldUpdateFocusInContext:/
// getIsViewFocused: with an arbitrary next/previous pair instead of a live
// focus engine.
//
// This does NOT subclass UIFocusUpdateContext: UIFocusUpdateContext has no
// public initializer, and plain [[UIFocusUpdateContext alloc] init] (which
// is all NSObject's default -init gives a subclass) trips an internal
// consistency check ("Invalid parameter not satisfying: focusSystem") on
// current UIKit, so a subclass instance throws at construction time before
// any test body runs. Instead this is a plain NSObject double; callers pass
// it to library methods typed to take UIFocusUpdateContext* via an explicit
// cast — those methods only ever message the five accessors below, which
// this class implements, so dynamic dispatch resolves correctly despite the
// unrelated static type.
@interface RNCEKVTestFocusContext : NSObject

@property (nonatomic, strong, nullable) UIView *nextFocusedView;
@property (nonatomic, strong, nullable) UIView *previouslyFocusedView;
@property (nonatomic, strong, nullable) id<UIFocusItem> nextFocusedItem;
@property (nonatomic, strong, nullable) id<UIFocusItem> previouslyFocusedItem;
@property (nonatomic, assign) UIFocusHeading focusHeading;

@end

#pragma mark - RNCEKVFocusHostDouble

// Minimal RNCEKVFocusProtocol host for RNCEKVFocusDelegate tests. Both
// protocol methods are backed by a settable property of the same name.
@interface RNCEKVFocusHostDouble : UIView <RNCEKVFocusProtocol>

@property (nonatomic, assign) BOOL canBeFocused;
@property (nonatomic, assign) BOOL focusableWrapper;

@end

#pragma mark - RNCEKVOrderHostDouble

// Minimal RNCEKVFocusOrderProtocol host for RNCEKVFocusSequenceDelegate /
// RNCEKVViewOrderGroupBase tests. Every order prop declared by the
// protocol is synthesized in the companion .mm; -getFocusTargetView
// returns the double itself.
@interface RNCEKVOrderHostDouble : UIView <RNCEKVFocusOrderProtocol>
@end

#pragma mark - RNCEKVFocusableItemDouble

// Records every -focus call it receives, so a test can assert which item
// a sequence/order delegate routed focus to.
@interface RNCEKVFocusableItemDouble : UIView <RNCEKVKeyboardFocusableProtocol>

@property (nonatomic, assign, readonly) NSUInteger focusCallCount;

@end

#pragma mark - Shared helpers

// Spins the main run loop for `cycles` iterations: each cycle schedules a
// dispatch_async(main) block that fulfills an XCTestExpectation and waits
// on it (5s timeout), draining already-queued main-thread blocks — e.g.
// focusOnMount's nested dispatch_async — in FIFO order without a sleep.
FOUNDATION_EXPORT void RNCEKVDrainMainQueue(NSUInteger cycles);

// Clears the key window's root view controller's rncekvCustomFocusView.
// Every test class calls this in both setUp and tearDown so tests observe
// a known starting state and don't leak focus state into the next test.
FOUNDATION_EXPORT void RNCEKVResetRootCustomFocusView(void);

NS_ASSUME_NONNULL_END

#endif /* RNCEKVTestSupport_h */
