//
//  RNCEKVExternalKeyboardHalloBase.h
//  Pods
//
//  Created by Artur Kalach on 08/04/2026.
//

#ifndef RNCEKVExternalKeyboardHalloBase_h
#define RNCEKVExternalKeyboardHalloBase_h

#import "RNCEKVViewOrderGroupBase.h"
#import "RNCEKVCustomFocusEffectProtocol.h"
#import "RNCEKVHaloProtocol.h"

#ifdef RCT_NEW_ARCH_ENABLED
#include "RNCEKVNativeProps.h"
#endif

@interface RNCEKVExternalKeyboardHalloBase : RNCEKVViewOrderGroupBase<RNCEKVHaloProtocol, RNCEKVCustomFocusEffectProtocol>

@property (nonatomic, assign) CGFloat haloCornerRadius;
@property (nonatomic, assign) CGFloat haloExpendX;
@property (nonatomic, assign) CGFloat haloExpendY;
@property (nonatomic, assign) BOOL isHaloHidden;
@property (nonatomic, assign) BOOL roundedHaloFix;

#ifdef RCT_NEW_ARCH_ENABLED
- (void)updateHaloProps:(const RNCEKV::HaloProps &)oldProps
               newProps:(const RNCEKV::HaloProps &)newProps;
#endif

@end

#endif /* RNCEKVExternalKeyboardHalloBase_h */
