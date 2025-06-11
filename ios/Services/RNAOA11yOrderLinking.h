//
//  RNAOA11yOrderLinking.h
//  A11yOrder
//
//  Created by Artur Kalach on 13/07/2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

#ifndef RNAOA11yOrderLinking_h
#define RNAOA11yOrderLinking_h

#import "RNAOA11yRelashioship.h"

@interface RNAOA11yOrderLinking : NSObject

+ (instancetype)sharedInstance;

- (void)add:(NSNumber*)position withOrderKey:(NSString*)orderKey withObject:(NSObject*)obj;
- (void)remove:(NSNumber*)position withOrderKey:(NSString*)orderKey;
- (void)setContainer:(NSString*)orderKey withView:(UIView*) view;
- (void)removeContainer:(NSString*)orderKey;
- (void)update:(NSNumber*)position lastPosition:(NSNumber*)_position withOrderKey:(NSString*)_orderKey withView:(UIView*) view;
- (RNAOA11yRelashioship*)getInfo:(NSString*)orderGroup;
@end

#endif /* RNAOA11yOrderLinking_h */
