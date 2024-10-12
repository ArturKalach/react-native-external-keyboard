#ifndef RNCEKVExternalKeyboardViewNativeComponent_h
#define RNCEKVExternalKeyboardViewNativeComponent_h
#import "RNCEKVKeyboardKeyPressHandler.h"
#import <UIKit/UIKit.h>
#import "RNCEKVKeyboardFocusProtocol.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>


NS_ASSUME_NONNULL_BEGIN

@interface RNCEKVExternalKeyboardView : RCTViewComponentView <UIContextMenuInteractionDelegate, RNCEKVKeyboardFocusProtocol>
@property (nonatomic, strong, nullable) NSNumber *isHaloActive;
@property BOOL canBeFocused;
@property BOOL hasOnPressUp;
@property BOOL hasOnPressDown;
@property BOOL hasOnFocusChanged;
@property BOOL isGroup;
@property (nullable, nonatomic, strong) UIView* myPreferredFocusedView;
@property BOOL autoFocus;

- (void)focus:(NSString *)rootViewId;

@end

NS_ASSUME_NONNULL_END


#else /* RCT_NEW_ARCH_ENABLED */


#import <React/RCTView.h>
@interface RNCEKVExternalKeyboardView : RCTView <UIContextMenuInteractionDelegate, RNCEKVKeyboardFocusProtocol>

@property BOOL autoFocus;
@property BOOL canBeFocused;
@property BOOL hasOnPressUp;
@property BOOL hasOnPressDown;
@property BOOL hasOnFocusChanged;
@property BOOL isGroup;
@property UIView* myPreferredFocusedView;
@property (nonatomic, copy) RCTDirectEventBlock onFocusChange;
@property (nonatomic, copy) RCTDirectEventBlock onContextMenuPress;
@property (nonatomic, copy) RCTBubblingEventBlock onKeyUpPress;
@property (nonatomic, copy) RCTBubblingEventBlock onKeyDownPress;

@property (nonatomic, strong, nullable) NSNumber *isHaloActive;
- (void)focus;
@end


#endif /* RCT_NEW_ARCH_ENABLED */
#endif /* ExternalKeyboardViewNativeComponent_h */
