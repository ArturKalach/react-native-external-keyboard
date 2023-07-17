#ifndef ExternalKeyboardViewNativeComponent_h
#define ExternalKeyboardViewNativeComponent_h

#import "KeyboardKeyPressHandler.h"
#import <UIKit/UIKit.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>


NS_ASSUME_NONNULL_BEGIN

@interface ExternalKeyboardView : RCTViewComponentView{
    KeyboardKeyPressHandler* _keyboardKeyPressHandler;
}
@property BOOL canBeFocused;
@property UIView* myPreferredFocusedView;
@end

NS_ASSUME_NONNULL_END


#else /* RCT_NEW_ARCH_ENABLED */


#import <React/RCTView.h>
@interface ExternalKeyboardView : RCTView {
    KeyboardKeyPressHandler* _keyboardKeyPressHandler;
}

@property BOOL canBeFocused;
@property UIView* myPreferredFocusedView;
@property (nonatomic, copy) RCTBubblingEventBlock onFocusChange;
@property (nonatomic, copy) RCTBubblingEventBlock onKeyUpPress;
@property (nonatomic, copy) RCTBubblingEventBlock onKeyDownPress;

@end


#endif /* RCT_NEW_ARCH_ENABLED */
#endif /* ExternalKeyboardViewNativeComponent_h */
