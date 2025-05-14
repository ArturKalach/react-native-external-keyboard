#ifndef RNCEKVTextInputFocusWrapper_h
#define RNCEKVTextInputFocusWrapper_h
#import <UIKit/UIKit.h>
#import <React/RCTUITextField.h>
#import "RNCEKVGroupIdentifierProtocol.h"
#import <React/RCTUITextView.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>


NS_ASSUME_NONNULL_BEGIN

@interface RNCEKVTextInputFocusWrapper : RCTViewComponentView <RNCEKVGroupIdentifierProtocol>{
    RCTUITextField* _textField;
    RCTUITextView* _textView;
}

@property (nonatomic, strong, nullable) NSNumber *isHaloActive;
@property BOOL canBeFocused;
@property BOOL blurOnSubmit;
@property int focusType;
@property int blurType;
@property BOOL multiline;
@property (nonatomic, strong, nullable) NSString *customGroupId;
- (UIView*)getFocusTargetView;

- (void)onFocusChange:(BOOL)isFocused;
- (void)onMultiplyTextSubmitHandler;

@end

NS_ASSUME_NONNULL_END


#else /* RCT_NEW_ARCH_ENABLED */


#import <React/RCTView.h>
@interface RNCEKVTextInputFocusWrapper : RCTView <RNCEKVGroupIdentifierProtocol>{
    RCTUITextField* _textField;
    RCTUITextView* _textView;
}

@property (nonatomic, strong, nullable) NSNumber *isHaloActive;
@property BOOL canBeFocused;
@property int focusType;
@property int blurType;
@property BOOL blurOnSubmit;
@property BOOL multiline;
@property (nonatomic, copy) RCTDirectEventBlock onFocusChange;
@property (nonatomic, copy) RCTDirectEventBlock onMultiplyTextSubmit;
@property NSString* customGroupId;
- (UIView*)getFocusTargetView;

- (void)onFocusChange:(BOOL)isFocused;
- (void)onMultiplyTextSubmitHandler;
@end


#endif /* RCT_NEW_ARCH_ENABLED */
#endif /* RNCEKVTextInputFocusWrapper_h */
