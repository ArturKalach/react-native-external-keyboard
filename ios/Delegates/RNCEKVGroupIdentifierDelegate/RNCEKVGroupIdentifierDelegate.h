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

@property (nonatomic, readonly, nonnull) NSString *focusGroupIdentifier;

@end


#endif /* RNCEKVGroupIdentifierDelegate_h */
