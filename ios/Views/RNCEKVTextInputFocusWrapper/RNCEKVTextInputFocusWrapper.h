#ifndef RNCEKVTextInputFocusWrapper_h
#define RNCEKVTextInputFocusWrapper_h
#import <UIKit/UIKit.h>
#import <React/RCTUITextField.h>
#import "RNCEKVGroupIdentifierProtocol.h"
#import "RNCEKVFocusOrderProtocol.h"
#import "RNCEKVKeyboardFocusableProtocol.h"
#import <React/RCTUITextView.h>
#import "RNCEKVViewGroupIdentifierBase.h"
#import "RNCEKVViewFocusChangeBase.h"

#import <React/RCTView.h>
@interface RNCEKVTextInputFocusWrapper : RNCEKVViewFocusChangeBase <RNCEKVKeyboardFocusableProtocol> {
    RCTUITextField* _textField;
    RCTUITextView* _textView;
}

@property int focusType;
@property int blurType;
@property BOOL blurOnSubmit;
@property BOOL multiline;

- (void)onMultiplyTextSubmitHandler: (RCTUITextView*) textView;
@end

#endif /* RNCEKVTextInputFocusWrapper_h */
