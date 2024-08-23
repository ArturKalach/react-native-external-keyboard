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
@property BOOL hasOnFocusChanged;
@property (nullable, nonatomic, strong) UIView* myPreferredFocusedView;

- (void)setHaloEffect:(BOOL)enable;
- (void)focus:(NSString *)rootViewId;
- (void)setAutoFocus:(NSString *)rootViewId;

@end

NS_ASSUME_NONNULL_END


#else /* RCT_NEW_ARCH_ENABLED */


#import <React/RCTView.h>
@interface RNCEKVExternalKeyboardView : RCTView <UIContextMenuInteractionDelegate>

@property BOOL canBeFocused;
@property BOOL hasOnPressUp;
@property BOOL hasOnPressDown;
@property BOOL hasOnFocusChanged;
@property UIView* myPreferredFocusedView;
@property (nonatomic, copy) RCTBubblingEventBlock onFocusChange;
@property (nonatomic, copy) RCTBubblingEventBlock onKeyUpPress;
@property (nonatomic, copy) RCTBubblingEventBlock onKeyDownPress;
@property (nonatomic, copy) RCTBubblingEventBlock onContextMenuPress;

- (void)setHaloEffect:(BOOL)enable;
- (void)focus:(NSString *)rootViewId;
- (void)setAutoFocus:(NSString *)rootViewId;
@end


#endif /* RCT_NEW_ARCH_ENABLED */
#endif /* ExternalKeyboardViewNativeComponent_h */
