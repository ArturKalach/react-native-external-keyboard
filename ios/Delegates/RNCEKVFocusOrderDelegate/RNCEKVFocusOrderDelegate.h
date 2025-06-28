//
//  RNCEKVFocusOrderDelegate.h
//  Pods
//
//  Created by Artur Kalach on 25/06/2025.
//

#ifndef RNCEKVFocusOrderDelegate_h
#define RNCEKVFocusOrderDelegate_h

#import <Foundation/Foundation.h>
#import "RNCEKVFocusOrderProtocol.h"

@interface RNCEKVFocusOrderDelegate : NSObject

- (instancetype _Nonnull)initWithView:(UIView<RNCEKVFocusOrderProtocol> *_Nonnull)view;

- (NSNumber*_Nullable)shouldUpdateFocusInContext:(UIFocusUpdateContext *_Nonnull)context;

- (void)linkId;
- (void)refreshId:(NSString*_Nullable)prev next:(NSString*_Nullable)next;
- (void)removeId;
- (void)setIsFocused:(BOOL)value;

- (void)refreshLeft:(NSString*_Nullable)prev next:(NSString*_Nullable)next;
- (void)refreshRight:(NSString*_Nullable)prev next:(NSString*_Nullable)next;
- (void)refreshUp:(NSString*_Nullable)prev next:(NSString*_Nullable)next;
- (void)refreshDown:(NSString*_Nullable)prev next:(NSString*_Nullable)next;
- (void)clear;

@end


#endif /* RNCEKVFocusOrderDelegate_h */
