//
//  RNCEKVOrderSubscriber.m
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 26/06/2025.
//

#import <Foundation/Foundation.h>
#import "RNCEKVOrderSubscriber.h"

@implementation RNCEKVOrderSubscriber

- (instancetype)initWithId:(NSString*)identifier updatedCallback:(LinkUpdatedCallback)onLinkUpdated
                        removedCallback:(LinkRemovedCallback)onLinkRemoved {
  self = [super init];
  if (self) {
    _identifier = identifier;
    _onLinkUpdated = onLinkUpdated;
    _onLinkRemoved = onLinkRemoved;
  }
  return self;
}

@end
