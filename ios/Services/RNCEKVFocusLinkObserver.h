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

@property (nonatomic, strong, readonly) RNCEKVFocusLinkObserver *focusLinkObserver;

+ (instancetype)sharedManager;

- (void)emitWithId:(NSString *)identifier link:(UIView *)link;
- (void)emitRemoveWithId:(NSString *)identifier;

- (RNCEKVOrderSubscriber*)subscribe:(NSString *)identifier
          onLinkUpdated:(LinkUpdatedCallback)onLinkUpdated
          onLinkRemoved:(LinkRemovedCallback)onLinkRemoved;

- (void)unsubscribeWithId:(NSString *)identifier
            onLinkUpdated:(LinkUpdatedCallback)onLinkUpdated
            onLinkRemoved:(LinkRemovedCallback)onLinkRemoved;

- (void)unsubscribe:(RNCEKVOrderSubscriber *)subscriber;

@end

#endif /* RNCEKVFocusLinkObserver_h */
