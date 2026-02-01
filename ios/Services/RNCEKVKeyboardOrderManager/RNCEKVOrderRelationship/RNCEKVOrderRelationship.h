//
//  RNCEKVOrderRelationship.h
//
//  Created by Artur Kalach on 13/07/2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

#ifndef RNCEKVOrderRelationship_h
#define RNCEKVOrderRelationship_h

@interface RNCEKVOrderRelationship : NSObject

@property UIView* entry;
@property UIView* exit;

- (void)add:(NSNumber*)position withObject:(NSObject*)obj;
- (void)remove:(NSNumber*)position;
- (void)update:(NSNumber*)lastPosition withPosition:(NSNumber*)position withObject:(NSObject*)obj;
- (void)clear;
- (NSArray*)getArray;
-(int)getItemIndex:(UIView*)element;
-(UIView*)getItem:(int)index;
-(BOOL)isEmpty;
-(int)count;

@end


#endif /* RNCEKVOrderRelationship_h */
