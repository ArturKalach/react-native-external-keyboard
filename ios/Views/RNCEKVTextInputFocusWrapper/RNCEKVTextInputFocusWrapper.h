#ifndef RNCEKVTextInputFocusWrapper_h
#define RNCEKVTextInputFocusWrapper_h
#import <UIKit/UIKit.h>
#import <React/RCTUITextField.h>
#import "RNCEKVGroupIdentifierProtocol.h"
#import "RNCEKVFocusOrderProtocol.h"
#import <React/RCTUITextView.h>
#import "RNCEKVViewOrderGroupBase.h"
#import "RNCEKVExternalKeyboardHalloBase.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>


NS_ASSUME_NONNULL_BEGIN

#define RKNA_PROP_UPDATE(prop, setter, newProps) \
if ([RNCEKVPropHelper isPropChanged: _##prop stringValue: newProps.prop]) { \
[self setter: [RNCEKVPropHelper unwrapStringValue: newProps.prop]]; \
}

@interface RNCEKVTextInputFocusWrapper : RNCEKVExternalKeyboardHalloBase <RNCEKVGroupIdentifierProtocol, RNCEKVFocusOrderProtocol>{
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

// RNCEKVFocusOrderProtocol
//@property (nonatomic, strong) NSString* orderGroup;
//@property NSNumber* lockFocus;
//@property NSNumber* orderPosition;
//@property (nonatomic, strong) NSString* orderLeft;
//@property (nonatomic, strong) NSString* orderRight;
//@property (nonatomic, strong) NSString* orderUp;
//@property (nonatomic, strong) NSString* orderDown;
//@property NSString* orderForward;
//@property NSString* orderBackward;
//@property NSString* orderLast;
//@property NSString* orderFirst;
//@property (nonatomic, strong) NSString* orderId;

- (UIView*)getFocusTargetView;

- (void)onFocusChange:(BOOL)isFocused;
- (void)onMultiplyTextSubmitHandler;

@end

NS_ASSUME_NONNULL_END


#else /* RCT_NEW_ARCH_ENABLED */


#import <React/RCTView.h>
@interface RNCEKVTextInputFocusWrapper : RNCEKVViewOrderGroupBase <RNCEKVGroupIdentifierProtocol, RNCEKVFocusOrderProtocol>{
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

// RNCEKVFocusOrderProtocol
@property (nonatomic, strong) NSString* orderGroup;
@property NSNumber* lockFocus;
@property NSNumber* orderPosition;
@property (nonatomic, strong) NSString* orderLeft;
@property (nonatomic, strong) NSString* orderRight;
@property (nonatomic, strong) NSString* orderUp;
@property (nonatomic, strong) NSString* orderDown;
@property NSString* orderForward;
@property NSString* orderBackward;
@property NSString* orderLast;
@property NSString* orderFirst;
@property (nonatomic, strong) NSString* orderId;

- (UIView*)getFocusTargetView;

- (void)onFocusChange:(BOOL)isFocused;
- (void)onMultiplyTextSubmitHandler;
@end


#endif /* RCT_NEW_ARCH_ENABLED */
#endif /* RNCEKVTextInputFocusWrapper_h */
