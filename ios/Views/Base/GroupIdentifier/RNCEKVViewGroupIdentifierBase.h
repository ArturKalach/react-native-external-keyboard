//
//  RNCEKVViewGroupIdentifierBase.h
//  Pods
//
//  Created by Artur Kalach on 09/04/2026.
//

#ifndef RNCEKVViewGroupIdentifierBase_h
#define RNCEKVViewGroupIdentifierBase_h

#import "RNCEKVExternalKeyboardHalloBase.h"
#import "RNCEKVGroupIdentifierProtocol.h"
#import "RNCEKVCustomGroudIdProtocol.h"

@interface RNCEKVViewGroupIdentifierBase : RNCEKVExternalKeyboardHalloBase<RNCEKVGroupIdentifierProtocol, RNCEKVCustomGroudIdProtocol>

@property (nonatomic, strong, nullable) NSString *customGroupId;

#ifdef RCT_NEW_ARCH_ENABLED
- (void)updateGroupIdentifierProps:(const RNCEKV::GroupIdentifierProps &)oldProps
                     newProps:(const RNCEKV::GroupIdentifierProps &)newProps;
#endif

@end


#endif /* RNCEKVViewGroupIdentifierBase_h */
