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

- (instancetype _Nonnull )initWithView:(UIView<RNCEKVGroupIdentifierProtocol> *_Nonnull)view;

- (NSString*_Nonnull) getFocusGroupIdentifier;
- (void)updateGroupIdentifier;
- (void)clear;
- (void)clearSubview:(UIView*_Nullable)subview;
- (void)syncCustomGroupId;

@end


#endif /* RNCEKVGroupIdentifierDelegate_h */
