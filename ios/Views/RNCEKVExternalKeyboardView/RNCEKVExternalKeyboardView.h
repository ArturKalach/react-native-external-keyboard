#ifndef RNCEKVExternalKeyboardViewNativeComponent_h
#define RNCEKVExternalKeyboardViewNativeComponent_h
#import "RNCEKVKeyboardKeyPressHandler.h"
#import <UIKit/UIKit.h>
#import "RNCEKVFocusProtocol.h"
#import "RNCEKVHaloProtocol.h"
#import "RNCEKVGroupIdentifierProtocol.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>

NS_ASSUME_NONNULL_BEGIN

#define RKNA_PROP_UPDATE(prop, setter, newProps) \
if ([RNCEKVPropHelper isPropChanged: _##prop stringValue: newProps.prop]) { \
    [self setter: [RNCEKVPropHelper unwrapStringValue: newProps.prop]]; \
}

@interface RNCEKVExternalKeyboardView : RCTViewComponentView <UIContextMenuInteractionDelegate, RNCEKVHaloProtocol, RNCEKVFocusProtocol, RNCEKVGroupIdentifierProtocol>
@property (nonatomic, strong, nullable) NSNumber *isHaloActive;
@property BOOL canBeFocused;
@property BOOL hasOnPressUp;
@property BOOL hasOnPressDown;
@property BOOL hasOnFocusChanged;
@property BOOL isGroup;
@property BOOL enableA11yFocus;
@property (nonatomic, assign) CGFloat haloCornerRadius;
@property (nonatomic, assign) CGFloat haloExpendX;
@property (nonatomic, assign) CGFloat haloExpendY;
@property (nullable, nonatomic, strong) UIView* myPreferredFocusedView;
@property (nonatomic, strong, nullable) NSString *customGroupId;
@property BOOL autoFocus;
@property (nonatomic, strong) UIFocusGuide *focusGuide;
@property NSNumber* orderPosition;
@property NSNumber* lockFocus;
@property NSString* orderGroup;
@property NSString* orderId;
@property NSString* orderLeft;
@property NSString* orderRight;
@property NSString* orderUp;
@property NSString* orderDown;
@property NSString* orderForward;
@property NSString* orderBackward;
@property BOOL isLinked;

- (UIView*)getFocusTargetView;

- (void)focus;

@end

NS_ASSUME_NONNULL_END


#else /* RCT_NEW_ARCH_ENABLED */


#import <React/RCTView.h>
@interface RNCEKVExternalKeyboardView : RCTView <UIContextMenuInteractionDelegate, RNCEKVHaloProtocol, RNCEKVFocusProtocol, RNCEKVGroupIdentifierProtocol>

@property BOOL autoFocus;
@property BOOL canBeFocused;
@property BOOL hasOnPressUp;
@property BOOL hasOnPressDown;
@property BOOL hasOnFocusChanged;
@property BOOL isGroup;
@property BOOL enableA11yFocus;
@property UIView* myPreferredFocusedView;
@property (nonatomic, assign) CGFloat haloCornerRadius;
@property (nonatomic, assign) CGFloat haloExpendX;
@property (nonatomic, assign) CGFloat haloExpendY;
@property (nonatomic, copy) RCTDirectEventBlock onFocusChange;
@property (nonatomic, copy) RCTDirectEventBlock onContextMenuPress;
@property (nonatomic, copy) RCTDirectEventBlock onKeyUpPress;
@property (nonatomic, copy) RCTDirectEventBlock onKeyDownPress;
@property (nonatomic, copy) RCTBubblingEventBlock onBubbledContextMenuPress;
@property (nonatomic, strong, nullable) NSString *customGroupId;
@property NSNumber* orderPosition;
@property NSNumber* lockFocus;
@property NSString* orderGroup;
@property NSString* orderId;
@property NSString* orderLeft;
@property NSString* orderRight;
@property NSString* orderUp;
@property NSString* orderDown;
@property NSString* orderForward;
@property NSString* orderBackward;
@property BOOL isLinked;

- (UIView*)getFocusTargetView;

@property (nonatomic, strong, nullable) NSNumber *isHaloActive;
- (void)focus;
@end


#endif /* RCT_NEW_ARCH_ENABLED */
#endif /* ExternalKeyboardViewNativeComponent_h */
