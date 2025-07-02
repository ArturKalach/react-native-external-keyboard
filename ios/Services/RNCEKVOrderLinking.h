//
//  RNCEKVOrderLinking.h
//
//
//  Created by Artur Kalach on 13/07/2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

#ifndef RNCEKVOrderLinking_h
#define RNCEKVOrderLinking_h

#import "RNCEKVRelashioship.h"

@interface RNCEKVOrderLinking : NSObject

+ (instancetype)sharedInstance;

- (void)add:(NSString*)orderKey withEntry:(UIView*)entry;
- (void)add:(NSString*)orderKey withExit:(UIView*)exit;
- (void)add:(NSNumber*)position withOrderKey:(NSString*)orderKey withObject:(NSObject*)obj;
- (void)remove:(NSNumber*)position withOrderKey:(NSString*)orderKey;
- (void)setContainer:(NSString*)orderKey withView:(UIView*) view;
- (void)removeContainer:(NSString*)orderKey;
- (void)update:(NSNumber*)position lastPosition:(NSNumber*)_position withOrderKey:(NSString*)_orderKey withView:(UIView*) view;
- (void)updateOrderKey:(NSString*)prev next:(NSString*)next position:(NSNumber*)position withView:(UIView*)view;
- (RNCEKVRelashioship*)getInfo:(NSString*)orderGroup;
- (void)storeOrderId:(NSString*)orderId withView:(UIView*) view;
- (UIView*)getOrderView:(NSString*)orderId;
- (void)cleanOrderId:(NSString*)orderId;

@end

#endif /* RNCEKVOrderLinking_h */
