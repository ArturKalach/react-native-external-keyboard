#ifndef RNCEKVExternalKeyboardViewNativeComponent_h
#define RNCEKVExternalKeyboardViewNativeComponent_h
#import "RNCEKVKeyboardKeyPressHandler.h"
#import <UIKit/UIKit.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>


NS_ASSUME_NONNULL_BEGIN

@interface RNCEKVExternalKeyboardView : RCTViewComponentView{
    RNCEKVKeyboardKeyPressHandler* _keyboardKeyPressHandler;
}
@property BOOL canBeFocused;
@property UIView* myPreferredFocusedView;


- (void)onFocusChange:(BOOL)isFocused;
- (void)onKeyDownPress:(NSDictionary*)dictionary;
- (void)onKeyUpPress:(NSDictionary*)dictionary;

@end

NS_ASSUME_NONNULL_END


#else /* RCT_NEW_ARCH_ENABLED */


#import <React/RCTView.h>
@interface RNCEKVExternalKeyboardView : RCTView {
    RNCEKVKeyboardKeyPressHandler* _keyboardKeyPressHandler;
}

@property BOOL canBeFocused;
@property UIView* myPreferredFocusedView;
@property (nonatomic, copy) RCTBubblingEventBlock onFocusChange;
@property (nonatomic, copy) RCTBubblingEventBlock onKeyUpPress;
@property (nonatomic, copy) RCTBubblingEventBlock onKeyDownPress;

@end


#endif /* RCT_NEW_ARCH_ENABLED */
#endif /* ExternalKeyboardViewNativeComponent_h */
