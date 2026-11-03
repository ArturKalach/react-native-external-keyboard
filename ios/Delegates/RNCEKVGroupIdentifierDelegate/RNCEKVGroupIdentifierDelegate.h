//
//  RNCEKVGroupIdentifierDelegate.h
//  Pods
//
//  Created by Artur Kalach on 24/01/2025.
//

#ifndef RNCEKVGroupIdentifierDelegate_h
#define RNCEKVGroupIdentifierDelegate_h

#import <Foundation/Foundation.h>
#import "RNCEKVGroupIdentifierProtocol.h"

@interface RNCEKVGroupIdentifierDelegate : NSObject

- (instancetype _Nonnull)initWithView:(UIView<RNCEKVGroupIdentifierProtocol> *_Nonnull)view;

/// Explicit custom id, else the generated unique id when enabled, else nil
/// (callers then fall back to `[super focusGroupIdentifier]`).
@property (nonatomic, readonly, nullable) NSString *focusGroupIdentifier;

@end


#endif /* RNCEKVGroupIdentifierDelegate_h */
