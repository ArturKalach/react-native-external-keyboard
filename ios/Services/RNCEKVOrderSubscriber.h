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

@property (nonatomic, weak) NSString* identifier;
@property (nonatomic, strong) LinkUpdatedCallback onLinkUpdated;
@property (nonatomic, strong) LinkRemovedCallback onLinkRemoved;

- (instancetype)initWithId:(NSString*)identifier updatedCallback:(LinkUpdatedCallback)onLinkUpdated
                        removedCallback:(LinkRemovedCallback)onLinkRemoved;

@end

#endif /* RNCEKVOrderSubscriber_h */
