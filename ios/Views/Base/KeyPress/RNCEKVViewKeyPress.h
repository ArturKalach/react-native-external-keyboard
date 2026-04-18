//
//  RNCEKVViewKeyPress.h
//  Pods
//
//  Created by Artur Kalach on 09/04/2026.
//

#ifndef RNCEKVViewKeyPress_h
#define RNCEKVViewKeyPress_h

#import "RNCEKVViewFocusRequestBase.h"

@interface RNCEKVViewKeyPress : RNCEKVViewFocusRequestBase

@property BOOL hasOnPressUp;
@property BOOL hasOnPressDown;

#ifdef RCT_NEW_ARCH_ENABLED
- (void)updateKeyPressProps:(const RNCEKV::KeyPressProps &)oldProps
                   newProps:(const RNCEKV::KeyPressProps &)newProps;

#endif

- (void)onKeyDownPressHandler:(NSDictionary *)eventInfo;
- (void)onKeyUpPressHandler:(NSDictionary *)eventInfo;

@end


#endif /* RNCEKVViewKeyPress_h */
