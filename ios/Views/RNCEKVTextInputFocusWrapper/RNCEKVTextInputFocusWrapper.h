#ifndef RNCEKVTextInputFocusWrapper_h
#define RNCEKVTextInputFocusWrapper_h
#import <UIKit/UIKit.h>
#import <React/RCTUITextField.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>


NS_ASSUME_NONNULL_BEGIN

@interface RNCEKVTextInputFocusWrapper : RCTViewComponentView{
    RCTUITextField* _textField;
}

@property (nonatomic, strong, nullable) NSNumber *isHaloActive;
@property BOOL canBeFocused;
@property int focusType;
@property int blurType;

- (void)onFocusChange:(BOOL)isFocused;
@end

NS_ASSUME_NONNULL_END


#else /* RCT_NEW_ARCH_ENABLED */


#import <React/RCTView.h>
@interface RNCEKVTextInputFocusWrapper : RCTView{
    RCTUITextField* _textField;
}

@property (nonatomic, strong, nullable) NSNumber *isHaloActive;
@property BOOL canBeFocused;
@property int focusType;
@property int blurType;
@property (nonatomic, copy) RCTDirectEventBlock onFocusChange;

@end


#endif /* RCT_NEW_ARCH_ENABLED */
#endif /* RNCEKVTextInputFocusWrapper_h */
