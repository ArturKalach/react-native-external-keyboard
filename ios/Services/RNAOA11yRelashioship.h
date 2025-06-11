//
//  RNAOA11yRelashioship.h
//  A11yOrder
//
//  Created by Artur Kalach on 13/07/2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

#ifndef RNAOA11yRelashioship_h
#define RNAOA11yRelashioship_h

@interface RNAOA11yRelashioship : NSObject

- (void)add:(NSNumber*)position withObject:(NSObject*)obj;
- (void)remove:(NSNumber*)position;
- (void)update:(NSNumber*)lastPosition withPosition:(NSNumber*)position withObject:(NSObject*)obj;
- (void)clear;
- (void)setContainer:(UIView*)view;
- (UIView*)getContainer;
- (NSArray*)getArray;

@end


#endif /* RNAOA11yRelashioship_h */
