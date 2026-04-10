//
//  RNCEKVViewOrderGroupBase.h
//  Pods
//
//  Created by Artur Kalach on 07/04/2026.
//

#ifndef RNCEKVViewOrderGroupBase_h
#define RNCEKVViewOrderGroupBase_h

#import <UIKit/UIKit.h>
#import "RNCEKVViewGroupBase.h"
#import "RNCEKVFocusOrderProtocol.h"
#import "RNCEKVFocusSequenceDelegate.h"
#import "RNCEKVFocusLinkDelegate.h"
#import "RNCEKVKeyboardFocusableProtocol.h"

#ifdef RCT_NEW_ARCH_ENABLED
#include "RNCEKVNativeProps.h"
#endif

@interface RNCEKVViewOrderGroupBase : RNCEKVViewGroupBase <RNCEKVFocusOrderProtocol, RNCEKVKeyboardFocusableProtocol>

- (void)cleanReferences;

@property (nonatomic, strong) NSString* orderGroup;
@property (nonatomic, strong) NSNumber* lockFocus;
@property (nonatomic, strong) NSNumber* orderPosition;
@property (nonatomic, strong) NSString* orderLeft;
@property (nonatomic, strong) NSString* orderRight;
@property (nonatomic, strong) NSString* orderUp;
@property (nonatomic, strong) NSString* orderDown;
@property (nonatomic, strong) NSString* orderForward;
@property (nonatomic, strong) NSString* orderBackward;
@property (nonatomic, strong) NSString* orderLast;
@property (nonatomic, strong) NSString* orderFirst;
@property (nonatomic, strong) NSString* orderId;

@property (nonatomic, strong, readonly) RNCEKVFocusSequenceDelegate* sequenceDelegate;
@property (nonatomic, strong, readonly) RNCEKVFocusLinkDelegate* linkDelegate;

#ifdef RCT_NEW_ARCH_ENABLED
- (void)updateFocusOrderProps:(const RNCEKV::OrderProps &)oldProps
                     newProps:(const RNCEKV::OrderProps &)newProps;
#endif

@end

#endif /* RNCEKVViewOrderGroupBase_h */
