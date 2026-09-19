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

#include "RNCEKVNativeProps.h"

@interface RNCEKVExternalKeyboardHalloBase : RNCEKVViewOrderGroupBase<RNCEKVHaloProtocol, RNCEKVCustomFocusEffectProtocol>

@property (nonatomic, assign) CGFloat haloCornerRadius;
@property (nonatomic, assign) CGFloat haloExpendX;
@property (nonatomic, assign) CGFloat haloExpendY;
@property (nonatomic, assign) BOOL isHaloHidden;
@property (nonatomic, assign) BOOL roundedHaloFix;

- (void)updateHaloProps:(const RNCEKV::HaloProps &)oldProps
               newProps:(const RNCEKV::HaloProps &)newProps;

@end

#endif /* RNCEKVExternalKeyboardHalloBase_h */
