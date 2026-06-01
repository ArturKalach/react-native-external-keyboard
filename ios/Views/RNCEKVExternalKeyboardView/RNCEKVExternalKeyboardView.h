#ifndef RNCEKVExternalKeyboardViewNativeComponent_h
#define RNCEKVExternalKeyboardViewNativeComponent_h
#import "RNCEKVKeyboardKeyPressHandler.h"
#import <UIKit/UIKit.h>
#import "RNCEKVFocusProtocol.h"
#import "RNCEKVFocusOrderProtocol.h"
#import "RNCEKVKeyboardFocusableProtocol.h"
#import "RNCEKVHaloProtocol.h"
#import "RNCEKVGroupIdentifierProtocol.h"
#import "RNCEKVExternalKeyboardHalloBase.h"
#import "RNCEKVViewKeyPress.h"

@interface RNCEKVExternalKeyboardView : RNCEKVViewKeyPress <RNCEKVKeyboardFocusableProtocol>

@property BOOL focusableWrapper;

#ifndef RCT_NEW_ARCH_ENABLED
@property (nonatomic, copy) RCTDirectEventBlock onFocusChange;
@property (nonatomic, copy) RCTDirectEventBlock onContextMenuPress;
@property (nonatomic, copy) RCTDirectEventBlock onKeyUpPress;
@property (nonatomic, copy) RCTDirectEventBlock onKeyDownPress;
@property (nonatomic, copy) RCTBubblingEventBlock onBubbledContextMenuPress;
#endif

@end


//#endif /* RCT_NEW_ARCH_ENABLED */
#endif /* ExternalKeyboardViewNativeComponent_h */
