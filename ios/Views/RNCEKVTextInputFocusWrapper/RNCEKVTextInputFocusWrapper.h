#ifndef RNCEKVTextInputFocusWrapper_h
#define RNCEKVTextInputFocusWrapper_h
#import <UIKit/UIKit.h>
#import <React/RCTUITextField.h>
#import "RNCEKVGroupIdentifierProtocol.h"
#import "RNCEKVFocusOrderProtocol.h"
#import <React/RCTUITextView.h>
#import "RNCEKVViewGroupIdentifierBase.h"
#import "RNCEKVViewFocusChangeBase.h"

#import <React/RCTView.h>
@interface RNCEKVTextInputFocusWrapper : RNCEKVViewFocusChangeBase {
    RCTUITextField* _textField;
    RCTUITextView* _textView;
}

@property int focusType;
@property int blurType;
@property BOOL blurOnSubmit;
@property BOOL multiline;

#ifndef RCT_NEW_ARCH_ENABLED
@property (nonatomic, copy) RCTDirectEventBlock onFocusChange;
@property (nonatomic, copy) RCTDirectEventBlock onMultiplyTextSubmit;
#endif

- (void)onMultiplyTextSubmitHandler: (RCTUITextView*) textView;
@end


//#endif /* RCT_NEW_ARCH_ENABLED */
#endif /* RNCEKVTextInputFocusWrapper_h */
