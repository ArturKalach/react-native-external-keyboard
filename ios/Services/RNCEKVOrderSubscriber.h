//
//  RNCEKVOrderSubscriber.h
//  Pods
//
//  Created by Artur Kalach on 26/06/2025.
//

#ifndef RNCEKVOrderSubscriber_h
#define RNCEKVOrderSubscriber_h

typedef void (^LinkUpdatedCallback)(UIView *link);
typedef void (^LinkRemovedCallback)(void);

@interface RNCEKVOrderSubscriber : NSObject

@property (nonatomic, weak) LinkUpdatedCallback onLinkUpdated;
@property (nonatomic, weak) LinkRemovedCallback onLinkRemoved;

- (instancetype)initWithUpdatedCallback:(LinkUpdatedCallback)onLinkUpdated
                        removedCallback:(LinkRemovedCallback)onLinkRemoved;

@end

#endif /* RNCEKVOrderSubscriber_h */
