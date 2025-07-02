//
//  RNCEKVRelashioship.h
//
//  Created by Artur Kalach on 13/07/2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

#ifndef RNCEKVRelashioship_h
#define RNCEKVRelashioship_h

@interface RNCEKVRelashioship : NSObject

@property UIView* entry;
@property UIView* exit;

- (void)add:(NSNumber*)position withObject:(NSObject*)obj;
- (void)remove:(NSNumber*)position;
- (void)update:(NSNumber*)lastPosition withPosition:(NSNumber*)position withObject:(NSObject*)obj;
- (void)clear;
- (void)setContainer:(UIView*)view;
- (UIView*)getContainer;
- (NSArray*)getArray;
-(BOOL)isEmpty;

@end


#endif /* RNCEKVRelashioship_h */
