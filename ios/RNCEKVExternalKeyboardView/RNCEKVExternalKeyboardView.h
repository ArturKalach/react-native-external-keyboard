#ifndef RNCEKVExternalKeyboardViewNativeComponent_h
#define RNCEKVExternalKeyboardViewNativeComponent_h
#import "RNCEKVKeyboardKeyPressHandler.h"
#import <UIKit/UIKit.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>


NS_ASSUME_NONNULL_BEGIN

@interface RNCEKVExternalKeyboardView : RCTViewComponentView <UIContextMenuInteractionDelegate>

@property BOOL canBeFocused;
@property BOOL hasOnPressUp;
@property BOOL hasOnPressDown;
@property (nullable, nonatomic, strong) UIView* myPreferredFocusedView;

- (void)onFocusChange:(BOOL)isFocused;
- (void)onKeyDownPress:(NSDictionary*)dictionary;
- (void)onKeyUpPress:(NSDictionary*)dictionary;
- (void)onContextMenuPress;
- (void)focus:(NSString *)rootViewId;

@end

NS_ASSUME_NONNULL_END


#else /* RCT_NEW_ARCH_ENABLED */


#import <React/RCTView.h>
@interface RNCEKVExternalKeyboardView : RCTView <UIContextMenuInteractionDelegate>

@property BOOL canBeFocused;
@property BOOL hasOnPressUp;
@property BOOL hasOnPressDown;
@property UIView* myPreferredFocusedView;
@property (nonatomic, copy) RCTBubblingEventBlock onFocusChange;
@property (nonatomic, copy) RCTBubblingEventBlock onKeyUpPress;
@property (nonatomic, copy) RCTBubblingEventBlock onKeyDownPress;
@property (nonatomic, copy) RCTBubblingEventBlock onContextMenuPress;
- (void)focus:(NSString *)rootViewId;
- (void)setAutoFocus:(NSString *)rootViewId;
@end


#endif /* RCT_NEW_ARCH_ENABLED */
#endif /* ExternalKeyboardViewNativeComponent_h */
