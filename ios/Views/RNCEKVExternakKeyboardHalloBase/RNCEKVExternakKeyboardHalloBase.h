//
//  RNCEKVExternakKeyboardHalloBase.h
//  Pods
//
//  Created by Artur Kalach on 08/04/2026.
//

#ifndef RNCEKVExternakKeyboardHalloBase_h
#define RNCEKVExternakKeyboardHalloBase_h

#import "RNCEKVViewOrderGroupBase.h"

@interface RNCEKVExternakKeyboardHalloBase : RNCEKVViewOrderGroupBase<RNCEKVHaloProtocol>

@property (nonatomic, assign) CGFloat haloCornerRadius;
@property (nonatomic, assign) CGFloat haloExpendX;
@property (nonatomic, assign) CGFloat haloExpendY;
@property (nonatomic, strong, nullable) NSNumber *isHaloActive;

@end

#endif /* RNCEKVExternakKeyboardHalloBase_h */
