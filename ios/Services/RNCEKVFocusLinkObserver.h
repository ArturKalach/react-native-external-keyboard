//
//  RNCEKVFocusLinkObserver.h
//  Pods
//
//  Created by Artur Kalach on 26/06/2025.
//

#ifndef RNCEKVFocusLinkObserver_h
#define RNCEKVFocusLinkObserver_h
#import "RNCEKVOrderSubscriber.h"

@interface RNCEKVFocusLinkObserver : NSObject

- (void)emitWithId:(NSString *)identifier link:(UIView *)link;
- (void)emitRemoveWithId:(NSString *)identifier;

- (void)subscribeWithId:(NSString *)identifier
          onLinkUpdated:(LinkUpdatedCallback)onLinkUpdated
          onLinkRemoved:(LinkRemovedCallback)onLinkRemoved;

- (void)unsubscribeWithId:(NSString *)identifier
            onLinkUpdated:(LinkUpdatedCallback)onLinkUpdated
            onLinkRemoved:(LinkRemovedCallback)onLinkRemoved;

@end

#endif /* RNCEKVFocusLinkObserver_h */
