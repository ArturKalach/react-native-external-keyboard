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

@end

#endif /* ExternalKeyboardViewNativeComponent_h */
