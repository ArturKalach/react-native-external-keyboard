//
//  RNCEKVViewGroupIdentifierBase.m
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 09/04/2026.
//

#import <Foundation/Foundation.h>
#import "RNCEKVViewGroupIdentifierBase.h"
#import "RNCEKVGroupIdentifierDelegate.h"

#ifdef RCT_NEW_ARCH_ENABLED
#include "RNCEKVNativeProps.h"
#import "RNCEKVPropHelper.h"
#endif

@implementation RNCEKVViewGroupIdentifierBase {
  RNCEKVGroupIdentifierDelegate *_gIdDelegate;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    _gIdDelegate = [[RNCEKVGroupIdentifierDelegate alloc] initWithView: self];
  }
  
  return self;
}

- (NSString *)focusGroupIdentifier {
  if(self.canBecomeFocused) {
    return [self customGroupIdentifier];
  }
  
  return [super focusGroupIdentifier];
}

- (NSString*)customGroupIdentifier {
  return _gIdDelegate.focusGroupIdentifier;
}


#ifdef RCT_NEW_ARCH_ENABLED
- (void)updateGroupIdentifierProps:(const RNCEKV::GroupIdentifierProps &)oldProps
                          newProps:(const RNCEKV::GroupIdentifierProps &)newProps {
  if (newProps.groupIdentifier.empty() && self.customGroupId != nil) {
    self.customGroupId = nil;
  }
  
  
  NSString* newGroupId = [RNCEKVPropHelper unwrapStringValue: newProps.groupIdentifier];
  
  if(![_customGroupId isEqual: newGroupId]) {
    [self setCustomGroupId: newGroupId];
  }
}
#endif

- (void) setCustomGroupId:(NSString *)customGroupId {
  _customGroupId = customGroupId;
}

- (void)cleanReferences {
  [super cleanReferences];
  _customGroupId = nil;
}


@end
