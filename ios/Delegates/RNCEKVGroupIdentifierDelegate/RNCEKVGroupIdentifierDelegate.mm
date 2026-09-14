//
//  RNCEKVGroupIdentifierDelegate.mm
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 24/01/2025.
//

#import <Foundation/Foundation.h>

#import "RNCEKVGroupIdentifierDelegate.h"

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


- (NSString *)tagId {
  if (!_tagId) {
    _tagId = [NSString stringWithFormat:@"app.group.%@", [NSUUID UUID].UUIDString];
  }
  return _tagId;
}

- (NSString *)focusGroupIdentifier {
  if (@available(iOS 14.0, *)) {
    return _delegate.customGroupId ?: self.tagId;
  }
  return self.tagId;
}

@end
