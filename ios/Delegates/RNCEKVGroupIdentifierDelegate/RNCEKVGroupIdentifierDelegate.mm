//
//  RNCEKVGroupIdentifierDelegate.mm
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 24/01/2025.
//

#import <Foundation/Foundation.h>

#import "RNCEKVGroupIdentifierDelegate.h"
#import "RNCEKVFocusEffectUtility.h"

@implementation RNCEKVGroupIdentifierDelegate {
  UIView<RNCEKVGroupIdentifierProtocol>* _delegate;
  NSString* _tagId;
}

- (instancetype _Nonnull )initWithView:(UIView<RNCEKVGroupIdentifierProtocol> *_Nonnull)delegate{
  self = [super init];
  if (self) {
    _delegate = delegate;
  }
  return self;
}


- (NSString*) getFocusGroupIdentifier {
  if(_delegate.customGroupId) {
    return _delegate.customGroupId;
  }
  
  if(_tagId) {
    return _tagId;
  }
  
  NSUUID *uuid = [NSUUID UUID];
  NSString *uniqueID = [uuid UUIDString];
  _tagId = [NSString stringWithFormat:@"app.group.%@", uniqueID];
  
  return _tagId;
}


- (void) updateGroupIdentifier {
  if (@available(iOS 14.0, *)) {
    UIView* focusView = [_delegate getFocusTargetView];
    if(focusView) {
      focusView.focusGroupIdentifier = [self getFocusGroupIdentifier];
    }
  }
}
@end
