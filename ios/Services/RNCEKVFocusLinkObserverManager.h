//
//  RNCEKVFocusLinkObserverManager.h
//  Pods
//
//  Created by Artur Kalach on 26/06/2025.
//

#ifndef RNCEKVFocusLinkObserverManager_h
#define RNCEKVFocusLinkObserverManager_h

#import <Foundation/Foundation.h>
#import "RNCEKVFocusLinkObserver.h"

@interface RNCEKVFocusLinkObserverManager : NSObject

@property (nonatomic, strong, readonly) RNCEKVFocusLinkObserver *focusLinkObserver;

+ (instancetype)sharedManager;

@end


#endif /* RNCEKVFocusLinkObserverManager_h */
